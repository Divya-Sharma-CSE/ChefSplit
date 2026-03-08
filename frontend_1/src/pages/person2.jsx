import { useState } from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  Receipt, 
  Wallet, 
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// ==================== STYLES ====================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFFBF5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#2D3319',
  },
  sidebar: {
    width: '256px',
    backgroundColor: '#FEFDFB',
    borderRight: '1px solid rgba(156, 175, 136, 0.15)',
    height: '100vh',
    position: 'fixed' as const,
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sidebarHeader: {
    padding: '24px',
    borderBottom: '1px solid rgba(156, 175, 136, 0.15)',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 500,
    color: '#9CAF88',
    margin: 0,
  },
  sidebarSubtitle: {
    fontSize: '12px',
    color: '#6B7557',
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: '16px',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  navButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    color: '#2D3319',
  },
  navButtonActive: {
    backgroundColor: '#9CAF88',
    color: '#FFFFFF',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid rgba(156, 175, 136, 0.15)',
  },
  sidebarCard: {
    backgroundColor: 'rgba(180, 199, 164, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center' as const,
  },
  mainContent: {
    marginLeft: '256px',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid rgba(156, 175, 136, 0.2)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 500,
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#6B7557',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  searchContainer: {
    position: 'relative' as const,
  },
  searchInput: {
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '24px',
    backgroundColor: '#F9F6F0',
    border: '1px solid rgba(156, 175, 136, 0.2)',
    outline: 'none',
    width: '256px',
    fontSize: '14px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  iconButton: {
    position: 'relative' as const,
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#9CAF88',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  main: {
    padding: '32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(156, 175, 136, 0.2)',
  },
  cardGradient: {
    background: 'linear-gradient(135deg, #9CAF88 0%, #B4C7A4 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: '#FFFFFF',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 500,
    margin: 0,
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#E8E4DC',
    borderRadius: '12px',
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #9CAF88 0%, #B4C7A4 100%)',
    borderRadius: '12px',
    transition: 'width 0.5s ease',
  },
  badge: {
    fontSize: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    backgroundColor: 'rgba(180, 199, 164, 0.2)',
    borderRadius: '12px',
    padding: '12px',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px',
    backdropFilter: 'blur(10px)',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  transactionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  transactionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(180, 199, 164, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  transactionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryBar: {
    marginBottom: '16px',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryProgress: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E8E4DC',
    borderRadius: '8px',
    overflow: 'hidden' as const,
  },
  footer: {
    marginTop: '48px',
    textAlign: 'center' as const,
  },
  fruitContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '32px',
    marginBottom: '16px',
  },
};

// ==================== MOCK DATA ====================
const pieChartData = [
  { name: 'Food', value: 1250, emoji: '🍔' },
  { name: 'Transport', value: 420, emoji: '🚗' },
  { name: 'Groceries', value: 890, emoji: '🛒' },
  { name: 'Shopping', value: 650, emoji: '🛍️' },
  { name: 'Subscriptions', value: 347, emoji: '📱' },
  { name: 'Misc', value: 300, emoji: '✨' },
];

const CHART_COLORS = ['#9CAF88', '#E8A87C', '#D4A5D1', '#85B8CB', '#F4C95D', '#C9A0DC'];

const categoryBudgets = [
  { name: 'Food', emoji: '🍔', spent: 1250, limit: 1500, color: '#9CAF88' },
  { name: 'Transport', emoji: '🚗', spent: 420, limit: 600, color: '#E8A87C' },
  { name: 'Groceries', emoji: '🛒', spent: 890, limit: 1200, color: '#D4A5D1' },
  { name: 'Shopping', emoji: '🛍️', spent: 650, limit: 800, color: '#85B8CB' },
  { name: 'Subscriptions', emoji: '📱', spent: 347, limit: 400, color: '#F4C95D' },
  { name: 'Misc', emoji: '✨', spent: 300, limit: 500, color: '#C9A0DC' },
];

const transactions = [
  { id: '1', name: 'Grocery Store', category: 'Groceries', emoji: '🛒', amount: 125.50, type: 'expense' as const, date: 'Mar 7' },
  { id: '2', name: 'Salary Deposit', category: 'Income', emoji: '💰', amount: 4200.00, type: 'income' as const, date: 'Mar 5' },
  { id: '3', name: 'Restaurant', category: 'Food', emoji: '🍔', amount: 48.90, type: 'expense' as const, date: 'Mar 6' },
  { id: '4', name: 'Gas Station', category: 'Transport', emoji: '🚗', amount: 65.00, type: 'expense' as const, date: 'Mar 6' },
  { id: '5', name: 'Netflix', category: 'Subscriptions', emoji: '📱', amount: 15.99, type: 'expense' as const, date: 'Mar 5' },
  { id: '6', name: 'Online Shopping', category: 'Shopping', emoji: '🛍️', amount: 89.99, type: 'expense' as const, date: 'Mar 4' },
  { id: '7', name: 'Coffee Shop', category: 'Food', emoji: '☕', amount: 12.50, type: 'expense' as const, date: 'Mar 4' },
  { id: '8', name: 'Freelance Work', category: 'Income', emoji: '💼', amount: 850.00, type: 'income' as const, date: 'Mar 3' },
];

const upcomingExpenses = [
  { id: '1', name: 'Rent Payment', emoji: '🏠', amount: 1500, dueDate: 'Mar 15', status: 'upcoming' as const },
  { id: '2', name: 'Internet Bill', emoji: '📡', amount: 60, dueDate: 'Mar 10', status: 'due-soon' as const },
  { id: '3', name: 'Gym Membership', emoji: '💪', amount: 45, dueDate: 'Mar 12', status: 'due-soon' as const },
  { id: '4', name: 'Phone Bill', emoji: '📱', amount: 55, dueDate: 'Mar 20', status: 'upcoming' as const },
];

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'categories', icon: Tag, label: 'Categories' },
  { id: 'transactions', icon: Receipt, label: 'Transactions' },
  { id: 'budget', icon: Wallet, label: 'Budget' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

// ==================== COMPONENTS ====================

function WalletCard() {
  return (
    <div style={styles.cardGradient}>
      <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '80px', opacity: 0.1 }}>💰</div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ ...styles.cardHeader, marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={20} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Balance</span>
          </div>
          <div style={styles.badge}>March 2026</div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '36px', margin: '0 0 4px 0' }}>$8,542.50</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
            <TrendingUp size={16} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Income</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} />
              <span style={{ fontSize: '18px' }}>$12,400</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Expenses</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingDown size={12} />
              <span style={{ fontSize: '18px' }}>$3,857</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetSummary() {
  const budgetUsed = 3857;
  const budgetTotal = 5000;
  const percentage = (budgetUsed / budgetTotal) * 100;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Monthly Budget</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6B7557' }}>
          <Calendar size={16} />
          <span>March 2026</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '32px' }}>${budgetUsed.toLocaleString()}</span>
            <span style={{ color: '#6B7557' }}> / ${budgetTotal.toLocaleString()}</span>
          </div>
          <span style={{ fontSize: '14px', color: '#6B7557' }}>{percentage.toFixed(1)}%</span>
        </div>
        
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
        </div>
      </div>

      <div style={styles.infoBox}>
        <AlertCircle size={16} color="#9CAF88" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: '#6B7557' }}>
          You have <span style={{ color: '#9CAF88' }}>${(budgetTotal - budgetUsed).toLocaleString()}</span> remaining for this month. Great job staying on track!
        </div>
      </div>
    </div>
  );
}

function ExpensePieChart() {
  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Expenses by Category</h3>
        <div style={{ fontSize: '12px', color: '#6B7557' }}>This Month</div>
      </div>

      <div style={{ height: '256px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid rgba(156, 175, 136, 0.2)',
                borderRadius: '12px',
                padding: '8px 12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {pieChartData.map((item, index) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0, backgroundColor: CHART_COLORS[index] }} />
            <span style={{ color: '#6B7557' }}>{item.emoji} {item.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(156, 175, 136, 0.2)', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#6B7557', marginBottom: '4px' }}>Total Spent</div>
        <div style={{ fontSize: '24px' }}>${total.toLocaleString()}</div>
      </div>
    </div>
  );
}

function CategoryBudgetCards() {
  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.cardTitle, marginBottom: '16px' }}>Category Budgets</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {categoryBudgets.map((category) => {
          const percentage = (category.spent / category.limit) * 100;
          const isOverBudget = percentage > 90;
          
          return (
            <div key={category.name} style={styles.categoryBar}>
              <div style={styles.categoryHeader}>
                <div style={styles.categoryLeft}>
                  <span style={{ fontSize: '20px' }}>{category.emoji}</span>
                  <span style={{ fontSize: '14px' }}>{category.name}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6B7557' }}>
                  <span style={{ color: isOverBudget ? '#D87C7C' : '#2D3319' }}>
                    ${category.spent}
                  </span>
                  <span> / ${category.limit}</span>
                </div>
              </div>
              
              <div style={styles.categoryProgress}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: isOverBudget ? '#D87C7C' : category.color,
                  borderRadius: '8px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              
              {isOverBudget && (
                <div style={{ fontSize: '12px', color: '#D87C7C', marginTop: '4px' }}>⚠️ Close to limit</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(156, 175, 136, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B7557' }}>Total Allocated</span>
          <span>${categoryBudgets.reduce((sum, cat) => sum + cat.limit, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function RecentTransactions() {
  const [selectedPeriod] = useState('March 2026');

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Recent Transactions</h3>
        
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: '#F9F6F0',
          borderRadius: '8px',
          fontSize: '14px',
          border: 'none',
          cursor: 'pointer',
        }}>
          <span>{selectedPeriod}</span>
          <ChevronDown size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '384px', overflowY: 'auto' }}>
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            style={styles.transactionItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(180, 199, 164, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={styles.transactionLeft}>
              <div style={styles.transactionIcon}>
                {transaction.emoji}
              </div>
              <div>
                <div style={{ fontSize: '14px' }}>{transaction.name}</div>
                <div style={{ fontSize: '12px', color: '#6B7557' }}>{transaction.category} • {transaction.date}</div>
              </div>
            </div>

            <div style={styles.transactionRight}>
              <div style={{ fontSize: '14px', color: transaction.type === 'income' ? '#9CAF88' : '#2D3319' }}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
              {transaction.type === 'income' ? (
                <ArrowDownRight size={16} color="#9CAF88" />
              ) : (
                <ArrowUpRight size={16} color="#6B7557" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(156, 175, 136, 0.2)', textAlign: 'center' }}>
        <button style={{
          fontSize: '14px',
          color: '#9CAF88',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}>
          View All Transactions →
        </button>
      </div>
    </div>
  );
}

function UpcomingExpenses() {
  const total = upcomingExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Upcoming Expenses</h3>
        <Calendar size={20} color="#6B7557" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {upcomingExpenses.map((expense) => (
          <div 
            key={expense.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(180, 199, 164, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{expense.emoji}</span>
              <div>
                <div style={{ fontSize: '14px' }}>{expense.name}</div>
                <div style={{ fontSize: '12px', color: '#6B7557', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Due {expense.dueDate}</span>
                  {expense.status === 'due-soon' && (
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#D87C7C',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite',
                    }}></span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '14px' }}>${expense.amount}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(156, 175, 136, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', color: '#6B7557' }}>Total Upcoming</span>
        <span style={{ fontSize: '18px' }}>${total.toLocaleString()}</span>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

function SavingsProgress() {
  const saved = 3250;
  const goal = 5000;
  const percentage = (saved / goal) * 100;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #B4C7A4 0%, rgba(156, 175, 136, 0.8) 100%)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '90px', opacity: 0.2 }}>🍑</div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <TrendingUp size={20} />
          <span style={{ fontSize: '14px', opacity: 0.9 }}>Savings Goal</span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '32px', marginBottom: '4px' }}>${saved.toLocaleString()}</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>of ${goal.toLocaleString()} goal</div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{
            width: '100%',
            height: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              height: '100%',
              width: `${percentage}%`,
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ opacity: 0.9 }}>{percentage.toFixed(0)}% Complete</span>
          <span style={{ opacity: 0.9 }}>${(goal - saved).toLocaleString()} to go</span>
        </div>

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', opacity: 0.8 }}>
            <span>Est. completion</span>
            <span>June 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStats() {
  const stats = [
    { label: 'Average Daily Spend', value: '$128.50', change: '-5.2%', trend: 'down' as const, emoji: '🫐' },
    { label: 'Highest Expense', value: '$1,500', change: 'Rent', trend: 'neutral' as const, emoji: '🏠' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{
          ...styles.card,
          position: 'relative',
          overflow: 'hidden',
          padding: '20px',
        }}>
          <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '32px', opacity: 0.2 }}>{stat.emoji}</div>
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontSize: '12px', color: '#6B7557', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.value}</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              {stat.trend === 'down' ? (
                <>
                  <ArrowDownRight size={12} color="#9CAF88" />
                  <span style={{ color: '#9CAF88' }}>{stat.change}</span>
                </>
              ) : stat.trend === 'up' ? (
                <>
                  <ArrowUpRight size={12} color="#D87C7C" />
                  <span style={{ color: '#D87C7C' }}>{stat.change}</span>
                </>
              ) : (
                <span style={{ color: '#6B7557' }}>{stat.change}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== MAIN APP ====================

export default function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  return (
    <div style={styles.container}>
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      
      <div style={styles.mainContent}>
        <Header />
        
        <main style={styles.main}>
          <div style={styles.grid}>
            {/* Top Row */}
            <div style={{ gridColumn: 'span 5' }}>
              <WalletCard />
            </div>
            <div style={{ gridColumn: 'span 7' }}>
              <BudgetSummary />
            </div>

            {/* Second Row */}
            <div style={{ gridColumn: 'span 5' }}>
              <ExpensePieChart />
            </div>
            <div style={{ gridColumn: 'span 7' }}>
              <CategoryBudgetCards />
            </div>

            {/* Third Row */}
            <div style={{ gridColumn: 'span 8' }}>
              <RecentTransactions />
            </div>

            {/* Right Column */}
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <UpcomingExpenses />
              <SavingsProgress />
              <QuickStats />
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.fruitContainer}>
              <span style={{ animation: 'bounce 2s infinite' }}>🍋</span>
              <span style={{ animation: 'bounce 2s infinite 0.2s' }}>🍑</span>
              <span style={{ animation: 'bounce 2s infinite 0.4s' }}>🫐</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7557' }}>
              Keep your finances fresh and healthy! 🌱
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
