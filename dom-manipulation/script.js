let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear previous quote
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.innerText = filteredQuotes[randomIndex].text;
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

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = ''; // Clear existing options
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
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

function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

function fetchQuotesFromServer() {
  // Simulate server request with a delay
  setTimeout(() => {
    const serverQuotes = [
      { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'inspiration' },
      { text: 'Life is 10% what happens to us and 90% how we react to it.', category: 'life' },
    ];
    quotes.push(...serverQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes fetched from server successfully!');
    showRandomQuote(); // Update the displayed quote after fetching from server
  }, 1000); // Simulate network delay
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
  createAddQuoteForm();
  fetchQuotesFromServer(); // Fetch quotes from server on page load
});
