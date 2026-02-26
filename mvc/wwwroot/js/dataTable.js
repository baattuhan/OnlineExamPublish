class DynamicPagination {
    constructor(tableId, options = {}) {
        this.table = document.getElementById(tableId);
        if (!this.table) {
            console.error(`Table with ID ${tableId} not found`);
            return;
        }

        // Default options
        this.options = {
            rowsPerPage: 10,
            visiblePages: 5,
            paginationContainer: `${tableId}Pagination`,
            ...options
        };

        this.currentPage = 1;
        this.filteredRows = [];
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchTerm = '';

        this.init();
    }

    init() {
        // Add event listeners for sortable headers
        this.addSortListeners();

        // Initialize pagination
        this.updateTable();
    }

    addSortListeners() {
        const sortableHeaders = this.table.querySelectorAll('th.sortable');
        sortableHeaders.forEach((th, index) => {
            th.addEventListener('click', () => {
                this.sortColumn = th.getAttribute('data-column');
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                this.sortTable(index);
            });
        });
    }

    sortTable(columnIndex) {
        const tbody = this.table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent;
            const bValue = b.cells[columnIndex].textContent;

            // Numeric sorting for numeric columns
            if (columnIndex === 3 || columnIndex === 4) { // Adjust these indexes as needed
                return this.sortDirection === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }

            // Text sorting for other columns
            return this.sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });

        // Clear existing rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        // Add sorted rows
        rows.forEach(row => tbody.appendChild(row));

        // Update sort indicators
        this.updateSortIndicators();

        // Update pagination
        this.updateTable();
    }

    updateSortIndicators() {
        const sortIndicators = this.table.querySelectorAll('.sort-indicator');
        sortIndicators.forEach(indicator => {
            indicator.textContent = '';
        });

        if (this.sortColumn) {
            const currentIndicator = this.table.querySelector(`th[data-column="${this.sortColumn}"] .sort-indicator`);
            if (currentIndicator) {
                currentIndicator.textContent = this.sortDirection === 'asc' ? ' ?' : ' ?';
            }
        }
    }

    updateTable(searchTerm = '') {
        this.searchTerm = searchTerm.toLowerCase().trim();
        this.currentPage = 1; // Reset to first page when searching or sorting

        // Filter rows based on search term
        this.filteredRows = Array.from(this.table.querySelectorAll('tbody tr'))
            .filter(row => {
                if (this.searchTerm === '') return true;

                // Check all cells in the row for the search term
                const cells = row.cells;
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].textContent.toLowerCase().includes(this.searchTerm)) {
                        return true;
                    }
                }
                return false;
            });

        // Update the display
        this.updateTableDisplay();
        this.initPagination();
    }

    updateTableDisplay() {
        const startIndex = (this.currentPage - 1) * this.options.rowsPerPage;
        const endIndex = startIndex + this.options.rowsPerPage;

        // Hide all rows first
        this.filteredRows.forEach(row => {
            row.style.display = 'none';
        });

        // Show rows for current page
        for (let i = startIndex; i < endIndex && i < this.filteredRows.length; i++) {
            this.filteredRows[i].style.display = '';
        }
    }

    initPagination() {
        const totalPages = Math.ceil(this.filteredRows.length / this.options.rowsPerPage);
        const paginationContainer = document.getElementById(this.options.paginationContainer);

        if (!paginationContainer) {
            console.error(`Pagination container with ID ${this.options.paginationContainer} not found`);
            return;
        }

        paginationContainer.innerHTML = '';

        // Don't show pagination if only one page
        if (totalPages <= 1) return;

        // Create pagination element
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';

        // Previous button
        const prevButton = this.createPaginationButton('Önceki', 'prev', this.currentPage === 1);
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateTableDisplay();
                this.initPagination();
            }
        });
        paginationDiv.appendChild(prevButton);

        // Page buttons
        const maxVisiblePages = this.options.visiblePages;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust if we're at the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page button (if needed)
        if (startPage > 1) {
            const firstButton = this.createPaginationButton('1', 'number', this.currentPage === 1);
            firstButton.addEventListener('click', () => {
                this.currentPage = 1;
                this.updateTableDisplay();
                this.initPagination();
            });
            paginationDiv.appendChild(firstButton);

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                paginationDiv.appendChild(ellipsis);
            }
        }

        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = this.createPaginationButton(i.toString(), 'number', this.currentPage === i);
            pageButton.addEventListener('click', () => {
                this.currentPage = i;
                this.updateTableDisplay();
                this.initPagination();
            });
            paginationDiv.appendChild(pageButton);
        }

        // Last page button (if needed)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                paginationDiv.appendChild(ellipsis);
            }

            const lastButton = this.createPaginationButton(totalPages.toString(), 'number', this.currentPage === totalPages);
            lastButton.addEventListener('click', () => {
                this.currentPage = totalPages;
                this.updateTableDisplay();
                this.initPagination();
            });
            paginationDiv.appendChild(lastButton);
        }

        // Next button
        const nextButton = this.createPaginationButton('Sonraki', 'next', this.currentPage === totalPages);
        nextButton.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updateTableDisplay();
                this.initPagination();
            }
        });
        paginationDiv.appendChild(nextButton);

        // Add page info
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Sayfa ${this.currentPage} / ${totalPages} (Toplam ${this.filteredRows.length} kayýt)`;
        pageInfo.className = 'page-info';
        paginationDiv.appendChild(pageInfo);

        paginationContainer.appendChild(paginationDiv);
    }

    createPaginationButton(text, type, isActive) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `pagination-btn ${type} ${isActive ? 'active' : ''}`;
        button.disabled = isActive && (type === 'prev' || type === 'next');
        return button;
    }
}