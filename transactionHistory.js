import { AuthService } from './auth.js';
import { localDb } from './localDb.js';
import { showNotification } from './script.js';

document.addEventListener('DOMContentLoaded', initTransactionHistory);

let allTransactions = [];
let currentUser = null;

async function initTransactionHistory() {
    currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        showNotification('Please log in to view your transaction history.', 'error');
        window.location.href = '/index.html'; // Redirect to home if not logged in
        return;
    }

    await fetchTransactions();
    setupFilterListeners();
    renderTransactions('all'); // Render all transactions initially
}

async function fetchTransactions() {
    try {
        allTransactions = await localDb.getTransactionsForUser(currentUser.id);
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
    } catch (error) {
        console.error('Error fetching transactions:', error);
        showNotification('Failed to load transaction history. Please try again later.', 'error');
    }
}

function renderTransactions(filterType) {
    const tableBody = document.getElementById('transaction-table-body');
    const emptyState = document.getElementById('transaction-empty-state');
    let filtered = [];

    if (filterType === 'all') {
        filtered = allTransactions;
    } else {
        filtered = allTransactions.filter(t => t.type.toLowerCase() === filterType.toLowerCase());
    }

    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    let currentBalance = currentUser.excel_coin_balance; // Start with current balance
    // Calculate balance for each transaction by iterating backwards
    const transactionsWithBalance = [];
    for (let i = filtered.length - 1; i >= 0; i--) {
        const transaction = { ...filtered[i] };
        if (i < filtered.length - 1) {
            // For previous transactions, adjust balance based on the next transaction's amount
            currentBalance -= filtered[i + 1].amount;
        }
        transaction.running_balance = currentBalance;
        transactionsWithBalance.unshift(transaction); // Add to the beginning to maintain original order
    }

    tableBody.innerHTML = transactionsWithBalance.map(t => `
        <tr>
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td>${t.description}</td>
            <td><span class="status ${t.type.toLowerCase().replace(/\s/g, '-')}">${t.type}</span></td>
            <td class="${t.amount > 0 ? 'credit' : 'debit'}">${t.amount > 0 ? '+' : ''}${t.amount} <i class="fas fa-coins"></i></td>
            <td>${t.running_balance} <i class="fas fa-coins"></i></td>
        </tr>
    `).join('');
}

function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.transaction-filters .filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const filterType = e.currentTarget.dataset.filter;
            renderTransactions(filterType);
        });
    });
}
