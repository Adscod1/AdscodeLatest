"use client";
import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDepositTo, setSelectedDepositTo] = useState('');
  const [selectedWithdrawFrom, setSelectedWithdrawFrom] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDepositDropdown, setShowDepositDropdown] = useState(false);
  const [showWithdrawFromDropdown, setShowWithdrawFromDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const totalBalance = 12450.75;
  
  const subaccounts = [
    { name: 'Product Sales', balance: 8450.50, description: 'Revenue from product transactions' },
    { name: 'Influencer Campaigns', balance: 4000.25, description: 'Funds set aside for influencer payouts' }
  ];

  const transactions = [
    { id: 1, date: '2025-10-19', description: 'Sale: Blue Sneakers (Order #1123)', account: 'Product Sales', amount: 120.00, status: 'Completed', type: 'credit' },
    { id: 2, date: '2025-10-18', description: 'Withdraw: Bank Transfer', account: 'Main Wallet', amount: -200.00, status: 'Processed', type: 'debit' },
    { id: 3, date: '2025-10-18', description: 'Campaign Funding: Influencer A', account: 'Influencer Campaigns', amount: -1500.00, status: 'Completed', type: 'debit' },
    { id: 4, date: '2025-10-15', description: 'Sale: Phone Case (Order #1106)', account: 'Product Sales', amount: 30.00, status: 'Completed', type: 'credit' }
  ];

  const fundsSources = ['Bank Transfer', 'Mobile Money', 'Card', 'External Payment Gateway'];
  const depositOptions = ['Main Wallet', 'Product Sales', 'Influencer Campaigns'];
  const withdrawDestinations = ['Bank Account', 'Mobile Money', 'Payment Gateway'];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Balance</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">${totalBalance.toFixed(2)}</div>
          <p className="text-xs text-gray-500">Available across main wallet and subaccounts</p>
          
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Business Funds Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Main Wallet</span>
                <span className="text-sm font-medium text-gray-900">$0.00</span>
              </div>
              <div className="text-xs text-gray-500 -mt-2">For general operations and transfers</div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Product Sales</span>
                <span className="text-sm font-medium text-gray-900">$8,450.50</span>
              </div>
              <div className="text-xs text-gray-500 -mt-2">Revenue from product transactions</div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Influencer Campaigns</span>
                <span className="text-sm font-medium text-gray-900">$4,000.25</span>
              </div>
              <div className="text-xs text-gray-500 -mt-2">Funds set aside for influencer payouts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Financial Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('transactions')}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              View Transactions
            </button>
            <button 
              onClick={() => setActiveTab('subaccounts')}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              Manage Subaccounts
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              View All (App-wide)
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
          <button 
            onClick={() => setActiveTab('transactions')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            See all
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-xs text-gray-500">{transaction.date} • {transaction.account}</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Search..." 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All accounts</option>
              <option>Main Wallet</option>
              <option>Product Sales</option>
              <option>Influencer Campaigns</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{transaction.account}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubaccounts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Subaccounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subaccounts.map((account, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{account.name}</h3>
                  <p className="text-xs text-gray-500">{account.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">${account.balance.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">ID: {index === 0 ? 'prod' : 'influencer'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Add
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAddFunds = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Add Funds</h2>
      <p className="text-sm text-gray-500 mb-6">Deposit funds to your wallet or subaccount</p>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
          <div className="relative">
            <button
              onClick={() => {
                setShowSourceDropdown(!showSourceDropdown);
                setShowDepositDropdown(false);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={selectedSource ? 'text-gray-900' : 'text-gray-500'}>
                {selectedSource || 'Bank Transfer'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showSourceDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {fundsSources.map((source) => (
                  <button
                    key={source}
                    onClick={() => {
                      setSelectedSource(source);
                      setShowSourceDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedSource === source ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deposit to</label>
          <div className="relative">
            <button
              onClick={() => {
                setShowDepositDropdown(!showDepositDropdown);
                setShowSourceDropdown(false);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={selectedDepositTo ? 'text-gray-900' : 'text-gray-500'}>
                {selectedDepositTo || 'Main Wallet'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showDepositDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {depositOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedDepositTo(option);
                      setShowDepositDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedDepositTo === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Select where the funds should be allocated</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reference / Note (optional)</label>
          <input 
            type="text" 
            placeholder="Payment reference, receipt number, note"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button className="flex-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Confirm Add Funds
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Tips: For bank transfers, include the reference number. Settlement time depends on the selected source.
        </p>
      </div>
    </div>
  );

  const renderWithdraw = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Withdraw Funds</h2>
      <p className="text-sm text-gray-500 mb-6">Transfer funds from your wallet to your bank account</p>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Withdraw from</label>
          <div className="relative">
            <button
              onClick={() => {
                setShowWithdrawFromDropdown(!showWithdrawFromDropdown);
                setShowDestinationDropdown(false);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={selectedWithdrawFrom ? 'text-gray-900' : 'text-gray-500'}>
                {selectedWithdrawFrom || 'Main Wallet'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showWithdrawFromDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {depositOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedWithdrawFrom(option);
                      setShowWithdrawFromDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedWithdrawFrom === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose the subaccount or main wallet to withdraw from.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <div className="relative">
            <button
              onClick={() => {
                setShowDestinationDropdown(!showDestinationDropdown);
                setShowWithdrawFromDropdown(false);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={selectedDestination ? 'text-gray-900' : 'text-gray-500'}>
                {selectedDestination || 'Bank Account'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showDestinationDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {withdrawDestinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => {
                      setSelectedDestination(dest);
                      setShowDestinationDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedDestination === dest ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bank / Provider Name</label>
          <input 
            type="text" 
            placeholder="e.g., Stanbic Bank"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account / Phone Number</label>
          <input 
            type="text" 
            placeholder="Account or phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reference / Note (optional)</label>
          <input 
            type="text" 
            placeholder="Payment instruction, reason for withdrawal"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button className="flex-1 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
            Confirm Withdraw
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Note: Withdrawals may take 1-3 business days depending on the payment provider. Fees may apply.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Wallet</h1>
          <p className="text-sm text-gray-500">Business funds overview, transactions and financial tools.</p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['overview', 'transactions', 'subaccounts', 'add-funds', 'withdraw'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'transactions' && renderTransactions()}
            {activeTab === 'subaccounts' && renderSubaccounts()}
            {activeTab === 'add-funds' && renderAddFunds()}
            {activeTab === 'withdraw' && renderWithdraw()}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Balance Snapshot</h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">${totalBalance.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Updated: 2025-10-18</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Active Subaccounts</h3>
              <div className="space-y-4">
                {subaccounts.map((account, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900">{account.name}</span>
                      <span className="text-sm font-semibold text-gray-900">${account.balance.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500">{account.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('add-funds')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  Add Funds
                </button>
                <button 
                  onClick={() => setActiveTab('withdraw')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  Withdraw
                </button>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  All Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;