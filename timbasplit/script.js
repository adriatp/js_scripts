class PokerSettlement {
    constructor() {
        this.players = [];
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.renderTable();
        this.attachEvents();
        this.updateCalculations();
    }

    attachEvents() {
        document.getElementById('addPlayer').addEventListener('click', () => this.addPlayer());
        
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('player-entry') || 
                e.target.classList.contains('player-final') ||
                e.target.classList.contains('player-name')) {
                this.updatePlayerFromRow(e.target.closest('tr'));
            }
        });
        
        document.addEventListener('focus', (e) => {
            if (e.target.classList.contains('player-entry') || 
                e.target.classList.contains('player-final')) {
                e.target.select();
            }
        }, true);
        
        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('player-entry') || 
                e.target.classList.contains('player-final')) {
                this.formatNumberInput(e.target);
                this.updatePlayerFromRow(e.target.closest('tr'));
            }
        }, true);
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-player')) {
                const row = e.target.closest('tr');
                const index = parseInt(row.dataset.index);
                if (confirm(`Are you sure you want to delete player "${this.players[index].name}"?`)) {
                    this.removePlayer(index);
                }
            }
        });
    }

    formatNumberInput(input) {
        let value = parseFloat(input.value);
        if (isNaN(value)) {
            value = 0;
        }
        input.value = value.toFixed(2);
    }

    addPlayer(name = '', entry = 0, final = 0) {
        const player = {
            id: Date.now() + Math.random(),
            name: name || `Player ${this.players.length + 1}`,
            entry: parseFloat(entry) || 0,
            final: parseFloat(final) || 0
        };
        this.players.push(player);
        this.saveToStorage();
        this.renderTable();
        this.updateCalculations();
        return player;
    }

    removePlayer(index) {
        if (index >= 0 && index < this.players.length) {
            this.players.splice(index, 1);
            this.saveToStorage();
            this.renderTable();
            this.updateCalculations();
        }
    }

    clearAllPlayers() {
        if (this.players.length === 0) return;
        if (confirm(`Are you sure you want to delete all ${this.players.length} players?`)) {
            this.players = [];
            this.saveToStorage();
            this.renderTable();
            this.updateCalculations();
        }
    }

    updatePlayerFromRow(row) {
        const index = parseInt(row.dataset.index);
        if (isNaN(index) || index < 0 || index >= this.players.length) return;

        const nameInput = row.querySelector('.player-name');
        const entryInput = row.querySelector('.player-entry');
        const finalInput = row.querySelector('.player-final');

        this.players[index].name = nameInput.value.trim();
        this.players[index].entry = parseFloat(entryInput.value) || 0;
        this.players[index].final = parseFloat(finalInput.value) || 0;

        this.saveToStorage();
        this.updateCalculations();
    }

    renderTable() {
        const tbody = document.getElementById('playersTableBody');
        tbody.innerHTML = '';

        this.players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;

            const diff = player.final - player.entry;
            const diffFormatted = diff.toFixed(2);
            const diffClass = diff >= 0 ? 'text-success positive' : 'text-danger negative';

            row.innerHTML = `

                <td><input type="text" class="form-control form-control-sm player-name" value="${player.name}" placeholder="Player name"></td>
                <td><input type="number" step="0.01" class="form-control form-control-sm player-entry" value="${player.entry.toFixed(2)}" placeholder="0.00"></td>
                <td><input type="number" step="0.01" class="form-control form-control-sm player-final" value="${player.final.toFixed(2)}" placeholder="0.00"></td>
                <td><input type="text" class="form-control form-control-sm player-diff ${diffClass}" value="${diffFormatted} €" readonly></td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm remove-player" title="Delete player">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        if (this.players.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="5" class="text-center text-muted py-4">
                     No players
                </td>
            `;
            tbody.appendChild(emptyRow);
        }
    }

    updateCalculations() {
        const totalEntry = this.players.reduce((sum, p) => sum + p.entry, 0);
        const totalFinal = this.players.reduce((sum, p) => sum + p.final, 0);
        const totalDiff = totalFinal - totalEntry;

        document.getElementById('totalEntry').textContent = totalEntry.toFixed(2) + ' €';
        document.getElementById('totalFinal').textContent = totalFinal.toFixed(2) + ' €';
        document.getElementById('totalDiff').textContent = totalDiff.toFixed(2) + ' €';

        this.calculateTransactions();
    }

    updateValidation(totalEntry, totalFinal) {
        const validationDiv = document.getElementById('sumValidation');
        const sumEntryDisplay = document.getElementById('sumEntryDisplay');
        const sumFinalDisplay = document.getElementById('sumFinalDisplay');
        const validationResult = document.getElementById('validationResult');

        sumEntryDisplay.textContent = totalEntry.toFixed(2);
        sumFinalDisplay.textContent = totalFinal.toFixed(2);

        if (Math.abs(totalEntry - totalFinal) < 0.01) {
            validationDiv.className = 'alert alert-success';
             validationResult.innerHTML = `<span class="badge badge-sum-ok">✓ Sums match</span>`;
        } else {
            validationDiv.className = 'alert alert-danger';
            const difference = (totalFinal - totalEntry).toFixed(2);
             validationResult.innerHTML = `<span class="badge badge-sum-error">✗ Sums don't match (difference: ${difference} €)</span>`;
        }
        validationDiv.classList.remove('d-none');
    }

    calculateTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = '';

        if (this.players.length === 0) {
            transactionsList.innerHTML = '<li class="list-group-item text-muted">No data to calculate transfers.</li>';
            return;
        }

        const playersWithDiff = this.players.map(p => ({
            name: p.name,
            diff: p.final - p.entry
        }));

        const creditors = playersWithDiff.filter(p => p.diff > 0).sort((a, b) => b.diff - a.diff);
        const debtors = playersWithDiff.filter(p => p.diff < 0).sort((a, b) => a.diff - b.diff);

        let transactions = [];
        let i = 0, j = 0;

        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];
            const amount = Math.min(creditor.diff, -debtor.diff);

            if (amount > 0.01) {
                transactions.push({
                    from: debtor.name,
                    to: creditor.name,
                    amount: amount
                });
            }

            creditor.diff -= amount;
            debtor.diff += amount;

            if (Math.abs(creditor.diff) < 0.01) i++;
            if (Math.abs(debtor.diff) < 0.01) j++;
        }

        if (transactions.length === 0) {
            transactionsList.innerHTML = '<li class="list-group-item text-muted">No transfers needed (everyone stays the same).</li>';
            return;
        }

        transactions.forEach(t => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${t.from} → ${t.to}</span>
                <span class="badge bg-primary rounded-pill">${t.amount.toFixed(2)} €</span>
            `;
            transactionsList.appendChild(li);
        });
    }

    saveToStorage() {
        localStorage.setItem('pokerSettlementPlayers', JSON.stringify(this.players));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('pokerSettlementPlayers');
        if (stored) {
            try {
                this.players = JSON.parse(stored);
            } catch (e) {
                this.players = [];
            }
        }
        if (this.players.length === 0) {
            this.addPlayer('Player 1', 0, 0);
            this.addPlayer('Player 2', 0, 0);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pokerApp = new PokerSettlement();
});
