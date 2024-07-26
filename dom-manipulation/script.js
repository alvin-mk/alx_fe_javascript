const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

let quotes = [];

// Load quotes from local storage (if available)
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes) {
  quotes = JSON.parse(storedQuotes);
  updateCategories();
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
}

function createAddQuoteForm() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    updateCategories();
    showRandomQuote();
    clearAddQuoteForm();
  } else {
    alert('Please enter both quote text and category!');
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function updateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = ''; // Clear existing options

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = quotes.filter(quote => selectedCategory === 'all' || quote.category === selectedCategory);
  if (filteredQuotes.length) {
    quoteDisplay.innerHTML = `"${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text}"`;
  } else {
    quoteDisplay.innerHTML = 'No quotes found for this category.';
  }
}

function clearAddQuoteForm() {
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

function exportToJsonFile() {
  const jsonContent = JSON.stringify(quotes);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    updateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}
// Assuming a function `fetchQuotesFromServer()` to retrieve quotes from a server

function syncWithServer() {
  fetchQuotesFromServer()
    .then(serverQuotes => {
      // Implement logic to compare serverQuotes with local quotes
      // and resolve conflicts based on a chosen strategy (e.g., overwrite local, merge, or prompt user)
      // Update local quotes and save to local storage
    })
    .catch(error => {
      console.error('Error syncing with server:', error);
    });
}

// Call syncWithServer periodically (e.g., every minute)
setInterval(syncWithServer, 60000);
