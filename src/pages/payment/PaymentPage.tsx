import React, { useMemo, useState } from 'react';
import { CreditCard, ArrowUp, ArrowDown, Repeat, CheckCircle2, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { entrepreneurs } from '../../data/users';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'funding';
  amount: number;
  sender: string;
  receiver: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  note?: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

export const PaymentPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [action, setAction] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [transferReceiver, setTransferReceiver] = useState('');
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([
    {
      id: 't1',
      type: 'deposit',
      amount: 5000,
      sender: 'Bank Account',
      receiver: user?.name ?? 'You',
      status: 'completed',
      date: '2026-07-09',
      note: 'Initial balance top-up'
    },
    {
      id: 't2',
      type: 'withdraw',
      amount: 1200,
      sender: user?.name ?? 'You',
      receiver: 'External account',
      status: 'completed',
      date: '2026-07-08',
      note: 'Platform payout'
    }
  ]);
  const [fundingAmount, setFundingAmount] = useState('');
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(entrepreneurs[0]?.id ?? '');
  const [message, setMessage] = useState('');

  const balance = user?.walletBalance ?? 0;

  const selectedEntrepreneurName = useMemo(() => {
    return entrepreneurs.find((item) => item.id === selectedEntrepreneur)?.name ?? 'Entrepreneur';
  }, [selectedEntrepreneur]);

  const handleTransactionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    const amountValue = Number(amount);
    if (!amountValue || amountValue <= 0) {
      setMessage('Enter a valid amount.');
      return;
    }

    if (!user) return;

    if (action === 'withdraw' && amountValue > balance) {
      setMessage('Insufficient balance for withdrawal.');
      return;
    }

    if (action === 'transfer' && (!transferReceiver || transferReceiver.trim().length < 3)) {
      setMessage('Enter a valid receiver name for transfer.');
      return;
    }

    const newBalance = action === 'deposit'
      ? balance + amountValue
      : balance - amountValue;

    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      type: action,
      amount: amountValue,
      sender: action === 'deposit' ? 'Bank Account' : user.name,
      receiver: action === 'withdraw' ? 'External account' : action === 'transfer' ? transferReceiver : user.name,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      note: action === 'transfer' ? 'Mock transfer' : `Mock ${action}`
    };

    setTransactionHistory([newTransaction, ...transactionHistory]);
    setAmount('');
    setTransferReceiver('');
    setMessage(`${action === 'deposit' ? 'Deposit' : action === 'withdraw' ? 'Withdrawal' : 'Transfer'} completed successfully.`);

    try {
      await updateProfile(user.id, { walletBalance: newBalance });
    } catch {
      // Fallback: local update if save fails
      console.warn('Failed to persist wallet changes.');
    }
  };

  const handleFundingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    const fundingValue = Number(fundingAmount);
    if (!fundingValue || fundingValue <= 0) {
      setMessage('Enter a valid funding amount.');
      return;
    }

    if (!user) return;

    if (fundingValue > balance) {
      setMessage('Insufficient balance to fund this deal.');
      return;
    }

    const entrepreneur = entrepreneurs.find((item) => item.id === selectedEntrepreneur);
    const receiverName = entrepreneur?.startupName ?? 'Startup';
    const newBalance = balance - fundingValue;

    const fundingTransaction: Transaction = {
      id: `f-${Date.now()}`,
      type: 'funding',
      amount: fundingValue,
      sender: user.name,
      receiver: receiverName,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      note: `Funding deal to ${receiverName}`
    };

    setTransactionHistory([fundingTransaction, ...transactionHistory]);
    setFundingAmount('');
    setMessage('Funding deal simulated successfully.');

    try {
      await updateProfile(user.id, { walletBalance: newBalance });
    } catch {
      console.warn('Failed to persist funding wallet changes.');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-semibold text-gray-900">Payment center</h1>
        <p className="text-gray-600 mt-2">Please sign in to access payment functionality.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage your wallet, run deposit and withdrawal simulations, and initiate mock funding deals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Quick payment actions</h2>
              <p className="text-sm text-gray-500">Simulate deposits, withdrawals, or transfers instantly.</p>
            </div>
            <div className="p-3 rounded-full bg-primary-50 text-primary-600">
              <CreditCard size={24} />
            </div>
          </CardHeader>

          <CardBody>
            <form className="space-y-5" onSubmit={handleTransactionSubmit}>
              <div className="flex flex-wrap gap-3">
                {['deposit', 'withdraw', 'transfer'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAction(option as 'deposit' | 'withdraw' | 'transfer')}
                    className={`rounded-2xl px-4 py-2 transition ${action === option ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  value={amount}
                  min={0}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  fullWidth
                />

                {action === 'transfer' && (
                  <Input
                    label="Transfer receiver"
                    value={transferReceiver}
                    onChange={(event) => setTransferReceiver(event.target.value)}
                    placeholder="Receiver name or account"
                    fullWidth
                  />
                )}
              </div>

              {message && (
                <p className="text-sm text-success-700">{message}</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">Current wallet balance: <span className="font-semibold text-gray-900">{formatCurrency(balance)}</span></p>
                <Button type="submit" size="lg">Submit {action}</Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Wallet balance</h2>
          </CardHeader>
          <CardBody>
            <div className="rounded-3xl border border-gray-100 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wider text-slate-300">Available balance</p>
                  <p className="mt-4 text-3xl font-semibold">{formatCurrency(balance)}</p>
                </div>
                <div className="rounded-full bg-white/10 p-3">
                  <Users size={28} className="text-white" />
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                <p>Available for deposits, withdrawals, and funding deals.</p>
                <p>All activity is simulated inside the platform.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Transaction history</h2>
              <p className="text-sm text-gray-500">Recent mock transactions show the sender, receiver, and status.</p>
            </div>
            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              <CheckCircle2 size={16} className="mr-2" />
              {transactionHistory.length} entries
            </div>
          </CardHeader>

          <CardBody className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 tracking-wider">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Receiver</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((transaction) => (
                  <tr key={transaction.id} className="bg-white rounded-2xl shadow-sm">
                    <td className="px-4 py-4 text-sm text-gray-700">{transaction.date}</td>
                    <td className="px-4 py-4 text-sm capitalize text-gray-800">{transaction.type}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{transaction.sender}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{transaction.receiver}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === 'completed' ? 'bg-success-100 text-success-700' : transaction.status === 'pending' ? 'bg-warning-100 text-warning-700' : 'bg-error-100 text-error-700'}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Funding deal</h2>
              <p className="text-sm text-gray-500">Investor → Entrepreneur funding simulation.</p>
            </div>
            <div className="p-3 rounded-full bg-accent-50 text-accent-600">
              <Repeat size={24} />
            </div>
          </CardHeader>

          <CardBody>
            {user.role === 'investor' ? (
              <form className="space-y-4" onSubmit={handleFundingSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select entrepreneur</label>
                  <select
                    value={selectedEntrepreneur}
                    onChange={(event) => setSelectedEntrepreneur(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    {entrepreneurs.map((entrepreneur) => (
                      <option key={entrepreneur.id} value={entrepreneur.id}>
                        {entrepreneur.startupName} — {entrepreneur.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Funding amount"
                  type="number"
                  value={fundingAmount}
                  min={0}
                  onChange={(event) => setFundingAmount(event.target.value)}
                  placeholder="0.00"
                  fullWidth
                />

                <div className="text-sm text-gray-600">
                  Funding will be recorded as a completed mock transaction and will reduce your balance.
                </div>

                <Button type="submit" fullWidth>Launch funding deal</Button>
              </form>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <p className="font-medium text-gray-900">Funding simulation is available for investor accounts.</p>
                <p className="mt-2">Entrepreneurs can view incoming mock funding flows here once the investor initiates them.</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
