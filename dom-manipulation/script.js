let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById('quoteDisplay').innerText = filteredQuotes[randomIndex].text;
}

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
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

function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(q => q.category === selectedCategory);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
    document.getElementById('categoryFilter').value = selectedCategory;
  }
  showRandomQuote();
});
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your server URL

async function syncWithServer() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    // Assuming serverQuotes is an array of quotes
    // Merge local and server quotes, with server taking precedence
    const mergedQuotes = [...quotes, ...serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text))];
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
    alert('Quotes synced successfully with the server!');
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
    document.getElementById('categoryFilter').value = selectedCategory;
  }
  showRandomQuote();
  setInterval(syncWithServer, 60000); // Sync with server every 60 seconds
});
