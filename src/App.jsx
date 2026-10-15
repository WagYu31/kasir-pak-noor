import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import POSTerminal from './components/POSTerminal';
import InventoryManager from './components/InventoryManager';
import MasterProducts from './components/MasterProducts';
import ReportsAnalytics from './components/ReportsAnalytics';
import PaymentModal from './components/PaymentModal';
import ThermalReceiptModal from './components/ThermalReceiptModal';
import CashierShiftModal from './components/CashierShiftModal';
import HelpHotkeyModal from './components/HelpHotkeyModal';
import CustomerDisplayModal from './components/CustomerDisplayModal';
import UserRoleModal, { USER_ROLES } from './components/UserRoleModal';
import LoginPage from './components/LoginPage';
import UserAccountManagerModal from './components/UserAccountManagerModal';
import TerminalManagerModal from './components/TerminalManagerModal';
import CustomerModal from './components/CustomerModal';

import { 
  INITIAL_WAREHOUSES, 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSFERS, 
  INITIAL_SALES_HISTORY,
  INITIAL_USERS,
  INITIAL_TERMINALS,
  INITIAL_CUSTOMERS,
  INITIAL_EXPENSES,
  INITIAL_COMMISSIONS
} from './data/mockData';

export default function App() {
  const [terminals, setTerminals] = useState(INITIAL_TERMINALS);
  const [isTerminalManagerOpen, setIsTerminalManagerOpen] = useState(false);
  const [users, setUsers] = useState(INITIAL_USERS); // Managed Cashier/Staff Accounts
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Controls Login Page display
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [currentUserRole, setCurrentRole] = useState('OWNER'); // 'OWNER', 'KEPALA_TOKO', 'KASIR', 'GUDANG_DC'
  const [isUserRoleModalOpen, setIsUserRoleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pos'); // 'pos', 'inventory', 'products', 'reports'
  const [activeTerminal, setActiveTerminal] = useState('Kasir 1');
  const [activeWarehouse, setActiveWarehouse] = useState('WH-01');
  const [priceTier, setPriceTier] = useState('eceran');

  // Application Data States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  const [salesHistory, setSalesHistory] = useState(INITIAL_SALES_HISTORY);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState(INITIAL_CUSTOMERS[0]);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [commissions, setCommissions] = useState(INITIAL_COMMISSIONS);

  // Active Cashier Shift State
  const [shiftData, setShiftData] = useState({
    cashier: 'Rina S.',
    openTime: '08:00 WIB',
    startingCash: 300000,
    cashLogs: [
      { id: 1, time: '08:30', type: 'OUT', amount: 25000, note: 'Beli Galon Aqua Toko' }
    ]
  });

  // Modal States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCustomerDisplayOpen, setIsCustomerDisplayOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Active Cart to Checkout
  const [checkoutData, setCheckoutData] = useState({
    cart: [],
    totalAmount: 0,
    queueName: 'Antrean 1'
  });

  // Last Finished Transaction for Reprint
  const [lastTransaction, setLastTransaction] = useState(salesHistory[0] || null);
  const [lastScannedItem, setLastScannedItem] = useState(null);

  // Handle Switch User Role (RBAC)
  const handleSelectRole = (newRoleId) => {
    setCurrentRole(newRoleId);
    const roleDef = USER_ROLES[newRoleId] || USER_ROLES.OWNER;
    
    // Update shift cashier name to match role
    if (newRoleId === 'KASIR') {
      setShiftData(prev => ({ ...prev, cashier: 'Rina S. (Kasir)' }));
    } else if (newRoleId === 'KEPALA_TOKO') {
      setShiftData(prev => ({ ...prev, cashier: 'Bambang S. (SPV)' }));
    } else if (newRoleId === 'OWNER') {
      setShiftData(prev => ({ ...prev, cashier: 'Pak Noor (Owner)' }));
    } else if (newRoleId === 'GUDANG_DC') {
      setShiftData(prev => ({ ...prev, cashier: 'Agus P. (DC Logistik)' }));
    }

    // Auto-switch to an allowed tab if current activeTab is prohibited
    if (!roleDef.allowedTabs.includes(activeTab)) {
      setActiveTab(roleDef.allowedTabs[0] || 'pos');
    }
    setIsUserRoleModalOpen(false);
  };

  // Handle Login Success from LoginPage
  const handleLoginSuccess = ({ user, role, terminal, warehouse, startingCash }) => {
    if (user) setCurrentUser(user);
    setCurrentRole(role);
    if (terminal) setActiveTerminal(terminal);
    if (warehouse) setActiveWarehouse(warehouse);
    if (startingCash) {
      setShiftData(prev => ({
        ...prev,
        cashier: `${user.name} (${user.roleTitle ? user.roleTitle.split('(')[0].trim() : 'Kasir'})`,
        startingCash: Number(startingCash)
      }));
    }
    const roleDef = USER_ROLES[role] || USER_ROLES.OWNER;
    if (!roleDef.allowedTabs.includes(activeTab)) {
      setActiveTab(roleDef.allowedTabs[0] || 'pos');
    }
    setIsAuthenticated(true);
  };

  // Handle Logout / Lock Terminal
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Global Keydown Handler for F1-F5 Navigation with RBAC checks
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const roleDef = USER_ROLES[currentUserRole] || USER_ROLES.OWNER;

      if (e.key === 'F1' && roleDef.allowedTabs.includes('pos')) {
        e.preventDefault();
        setActiveTab('pos');
      } else if (e.key === 'F2' && roleDef.allowedTabs.includes('inventory')) {
        e.preventDefault();
        setActiveTab('inventory');
      } else if (e.key === 'F3' && roleDef.allowedTabs.includes('products')) {
        e.preventDefault();
        setActiveTab('products');
      } else if (e.key === 'F4' && roleDef.allowedTabs.includes('reports')) {
        e.preventDefault();
        setActiveTab('reports');
      } else if (e.key === 'F5' && roleDef.allowedTabs.includes('shift')) {
        e.preventDefault();
        setIsShiftOpen(true);
      } else if (e.key === 'F9') {
        e.preventDefault();
        setIsUserRoleModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentUserRole, activeTab]);

  // Trigger Checkout Modal from POS Terminal
  const handleOpenCheckout = (cart, totalAmount, queueName) => {
    setCheckoutData({ cart, totalAmount, queueName });
    setIsPaymentOpen(true);
  };

  const handleAddCustomer = (newCust) => {
    setCustomers(prev => [newCust, ...prev]);
  };

  const handleAddExpense = (newExp) => {
    setExpenses(prev => [newExp, ...prev]);
    setShiftData(prev => ({
      ...prev,
      cashLogs: [
        ...prev.cashLogs,
        {
          id: Date.now(),
          time: newExp.time,
          type: 'OUT',
          amount: newExp.amount,
          note: `${newExp.category}: ${newExp.description}`
        }
      ]
    }));
  };

  // Payment Completed Callback
  const handlePaymentSuccess = (transactionData) => {
    // 1. Deduct Stock from active warehouse based on multiplier
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const itemsOfProductInCart = transactionData.items.filter(item => item.productId === p.id);
        if (itemsOfProductInCart.length > 0) {
          const totalPcsDeducted = itemsOfProductInCart.reduce((sum, item) => sum + (item.qty * item.multiplier), 0);
          return {
            ...p,
            stock: {
              ...p.stock,
              [activeWarehouse]: Math.max(0, (p.stock[activeWarehouse] || 0) - totalPcsDeducted)
            }
          };
        }
        return p;
      });
    });

    // 2. Append to Sales History
    setSalesHistory(prev => [transactionData, ...prev]);

    // 3. Update Customer Debt if Piutang or DP
    if (transactionData.remainingDebt > 0 && transactionData.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === transactionData.customerId) {
          const newDebt = (c.currentDebt || 0) + transactionData.remainingDebt;
          return {
            ...c,
            currentDebt: newDebt,
            dueDate: transactionData.dueDate || c.dueDate,
            status: (c.creditLimit > 0 && newDebt >= c.creditLimit) ? 'OVERDUE' : 'ACTIVE'
          };
        }
        return c;
      }));
    }

    // 4. Update Commission for Cashier
    setCommissions(prev => prev.map(comm => {
      if (comm.role === activeTerminal || comm.cashierName.includes(shiftData.cashier)) {
        return {
          ...comm,
          totalSales: comm.totalSales + transactionData.totalAmount,
          commissionAmount: comm.commissionAmount + Math.round(transactionData.totalAmount * 0.015)
        };
      }
      return comm;
    }));

    // 5. Save as Last Transaction
    setLastTransaction(transactionData);

    // 6. Close Payment Modal & Open Receipt
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
  };

  // If user is not logged in / terminal locked, show retail Login Page
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        users={users}
        terminals={terminals}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-800">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTerminal={activeTerminal}
        setActiveTerminal={setActiveTerminal}
        terminals={terminals}
        onOpenTerminalManager={() => setIsTerminalManagerOpen(true)}
        activeWarehouse={activeWarehouse}
        setActiveWarehouse={setActiveWarehouse}
        shiftData={shiftData}
        onOpenShiftModal={() => setIsShiftOpen(true)}
        onOpenHelpModal={() => setIsHelpOpen(true)}
        currentRole={currentUserRole}
        setCurrentRole={handleSelectRole}
        onOpenUserRoleModal={() => setIsUserRoleModalOpen(true)}
        onOpenAccountManager={() => setIsAccountManagerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-24">
        {activeTab === 'pos' && (
          <POSTerminal
            products={products}
            setProducts={setProducts}
            activeWarehouse={activeWarehouse}
            priceTier={priceTier}
            setPriceTier={setPriceTier}
            onCheckout={handleOpenCheckout}
            lastTransaction={lastTransaction}
            onReprintLast={() => {
              if (lastTransaction) setIsReceiptOpen(true);
            }}
            onOpenCustomerDisplay={() => setIsCustomerDisplayOpen(true)}
            lastScannedItem={lastScannedItem}
            setLastScannedItem={setLastScannedItem}
            currentRole={currentUserRole}
            activeTerminal={activeTerminal}
            shiftData={shiftData}
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            onAddCustomer={handleAddCustomer}
            expenses={expenses}
            onAddExpense={handleAddExpense}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            products={products}
            setProducts={setProducts}
            warehouses={warehouses}
            transfers={transfers}
            setTransfers={setTransfers}
            currentRole={currentUserRole}
            salesHistory={salesHistory}
            onViewTransactionAudit={() => setActiveTab('reports')}
          />
        )}

        {activeTab === 'products' && (
          <MasterProducts
            products={products}
            setProducts={setProducts}
            currentRole={currentUserRole}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsAnalytics
            salesHistory={salesHistory}
            products={products}
            warehouses={warehouses}
            currentRole={currentUserRole}
            customers={customers}
            expenses={expenses}
            commissions={commissions}
            onRecordDebtPayment={(customerId, paidAmount) => {
              setCustomers(prev => prev.map(c => {
                if (c.id === customerId) {
                  const updatedDebt = Math.max(0, (c.currentDebt || 0) - paidAmount);
                  return {
                    ...c,
                    currentDebt: updatedDebt,
                    status: updatedDebt === 0 ? 'ACTIVE' : c.status
                  };
                }
                return c;
              }));
            }}
          />
        )}
      </main>

      {/* Floating System Quick Info Bar (Responsive Light Theme) */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 sm:px-4 text-[11px] text-slate-500 flex items-center justify-between z-30 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">Database ACID:</span>{' '}
            <button
              onClick={() => setIsTerminalManagerOpen(true)}
              className="text-slate-800 font-bold hover:underline cursor-pointer"
              title="Buka Manajemen Mesin Kasir & Hardware"
            >
              {terminals.filter(t => t.status === 'ONLINE').length} Kasir Aktif
            </button>
          </span>
          <span className="text-slate-300">|</span>
          <span>Gudang: <strong className="text-emerald-700 font-bold">{activeWarehouse === 'WH-01' ? 'Toko (Depan)' : 'Pusat (DC)'}</strong></span>
          <span className="text-slate-300">|</span>
          <span>Tier: <strong className="text-emerald-700 uppercase font-bold">{priceTier}</strong></span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline">Peran: <button onClick={() => setIsUserRoleModalOpen(true)} className="text-slate-900 font-bold hover:underline cursor-pointer">{USER_ROLES[currentUserRole]?.name}</button></span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 whitespace-nowrap pl-2">
          <button
            onClick={() => setIsCustomerDisplayOpen(true)}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Customer Display [F8]</span>
          </button>
          <span className="hidden lg:inline text-slate-300">•</span>
          <span className="hidden lg:inline text-slate-400">Pintasan: <span className="kbd-badge text-[10px]">F1-F12</span></span>
          <span className="hidden xl:inline text-slate-300">•</span>
          <span className="hidden xl:inline text-slate-500 font-semibold">POS Pak Noor v2.0</span>
        </div>
      </footer>

      {/* MODALS */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cart={checkoutData.cart}
        totalAmount={checkoutData.totalAmount}
        onPaymentSuccess={handlePaymentSuccess}
        activeTerminal={activeTerminal}
        shiftData={shiftData}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={(cust) => {
          setSelectedCustomer(cust);
          setIsCustomerModalOpen(false);
        }}
        onAddCustomer={handleAddCustomer}
      />

      <ThermalReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={lastTransaction}
      />

      <CashierShiftModal
        isOpen={isShiftOpen}
        onClose={() => setIsShiftOpen(false)}
        shiftData={shiftData}
        setShiftData={setShiftData}
        salesHistory={salesHistory}
      />

      <HelpHotkeyModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <CustomerDisplayModal
        isOpen={isCustomerDisplayOpen}
        onClose={() => setIsCustomerDisplayOpen(false)}
        cart={checkoutData.cart.length > 0 ? checkoutData.cart : (checkoutData.queueName && checkoutData.cart)}
        totalAmount={checkoutData.totalAmount}
        activeQueue={checkoutData.queueName || 'Antrean 1'}
        lastScannedItem={lastScannedItem}
      />

      <UserRoleModal
        isOpen={isUserRoleModalOpen}
        onClose={() => setIsUserRoleModalOpen(false)}
        currentRole={currentUserRole}
        onSelectRole={handleSelectRole}
      />

      <UserAccountManagerModal
        isOpen={isAccountManagerOpen}
        onClose={() => setIsAccountManagerOpen(false)}
        users={users}
        setUsers={setUsers}
        currentRole={currentUserRole}
        onSelectRole={handleSelectRole}
      />

      <TerminalManagerModal
        isOpen={isTerminalManagerOpen}
        onClose={() => setIsTerminalManagerOpen(false)}
        terminals={terminals}
        setTerminals={setTerminals}
        activeTerminal={activeTerminal}
        setActiveTerminal={setActiveTerminal}
        currentRole={currentUserRole}
        currentUser={currentUser}
      />

    </div>
  );
}
