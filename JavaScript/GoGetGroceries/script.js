let itemList = [];
let totalPrice = 0;

// Initialize categoryRankings with 3 sample rankings
let categoryRankings = [
    {
        name: "Pam",
        categories: [
            "Produce",
            "Bakery & Grains",
            "Meat, Poultry & Seafood",
            "Dairy & Eggs",
            "Frozen Foods",
            "Beverages",
            "Pantry Staples",
            "Snacks & Sweets",
            "Household & Hygiene",
            "Baby & Pet Supplies"
        ]
    },
    {
        name: "Carrefour",
        categories: [
            "Beverages",
            "Pantry Staples",
            "Bakery & Grains",
            "Snacks & Sweets",
            "Dairy & Eggs",
            "Frozen Foods",
            "Produce",
            "Meat, Poultry & Seafood",
            "Household & Hygiene",
            "Baby & Pet Supplies"
        ]
    },
    {
        name: "Borello",
        categories: [
            "Frozen Foods",
            "Household & Hygiene",
            "Baby & Pet Supplies",
            "Pantry Staples",
            "Beverages",
            "Bakery & Grains",
            "Dairy & Eggs",
            "Produce",
            "Meat, Poultry & Seafood",
            "Snacks & Sweets"
        ]
    }
];
let currentRanking = null; // The currently selected ranking

const usualItems = ['Milk', 'Eggs', 'Bread', 'Butter', 'Cheese', 'Apples', 'Bananas', 'Chicken', 'Pasta', 'Rice', 'Coca-Cola', 'Beef', 'Snickers', 'Chips', 'Cat Litter', 'Frozen Pizza'];
const usualItemsDetails = {
    'Milk': { price: 1.3, category: 'Dairy & Eggs' },
    'Eggs': { price: 2, category: 'Dairy & Eggs' },
    'Bread': { price: 1.2, category: 'Bakery & Grains' },
    'Butter': { price: 5, category: 'Dairy & Eggs' },
    'Cheese': { price: 3.5, category: 'Dairy & Eggs' },
    'Apples': { price: 3, category: 'Produce' },
    'Bananas': { price: 1.1, category: 'Produce' },
    'Chicken': { price: 7, category: 'Meat, Poultry & Seafood' },
    'Pasta': { price: 2.5, category: 'Bakery & Grains' },
    'Rice': { price: 1.5, category: 'Bakery & Grains' },
    'Coca-Cola': { price: 1.8, category: 'Beverages' },
    'Beef': { price: 12, category: 'Meat, Poultry & Seafood' },
    'Snickers': { price: 1, category: 'Snacks & Sweets' },
    'Chips': { price: 0.99, category: 'Snacks & Sweets' },
    'Cat Litter': { price: 8.2, category: 'Baby & Pet Supplies' },
    'Frozen Pizza': { price: 3.3, category: 'Frozen Foods' },
};

const allCategories = [
    "Produce",
    "Dairy & Eggs",
    "Meat, Poultry & Seafood",
    "Bakery & Grains",
    "Frozen Foods",
    "Beverages",
    "Pantry Staples",
    "Snacks & Sweets",
    "Household & Hygiene",
    "Baby & Pet Supplies"
];

// Function to get details of a usual item
function getUsualItemDetails(itemName) {
    const lowerItemName = itemName.toLowerCase();
    for (const key in usualItemsDetails) {
        if (key.toLowerCase() === lowerItemName) {
            return usualItemsDetails[key];
        }
    }
    return null;
}

// Function to save data to localStorage
function saveData() {
    try {
        localStorage.setItem('itemList', JSON.stringify(itemList));
        localStorage.setItem('categoryRankings', JSON.stringify(categoryRankings));
        localStorage.setItem('currentRanking', JSON.stringify(currentRanking));
    } catch (error) {
        console.error("Error saving data to localStorage:", error);
    }
}

// Function to load data from localStorage
function loadData() {
    try {
        const storedItemList = localStorage.getItem('itemList');
        if (storedItemList) {
            itemList = JSON.parse(storedItemList);
        }

        const storedCategoryRankings = localStorage.getItem('categoryRankings');
        if (storedCategoryRankings) {
            categoryRankings = JSON.parse(storedCategoryRankings);
        }

        const storedCurrentRanking = localStorage.getItem('currentRanking');
        if (storedCurrentRanking) {
            currentRanking = JSON.parse(storedCurrentRanking);
        }
    } catch (error) {
        console.error("Error loading data from localStorage:", error);
    }
}

// To manage the form steps
function startAddItem() {
    document.getElementById("add-item-form").style.display = "block";
    showStep(1);
    document.getElementById("itemName").focus();
}

function showStep(step) {
    document.querySelectorAll(".form-step").forEach(step => step.classList.remove("active"));
    document.getElementById(`step${step}`).classList.add("active");
}

function nextStep(currentStep) {
    if (currentStep === 1) {
        const itemName = document.getElementById("itemName").value.trim();
        if (!itemName) return alert("Enter item name.");
        const itemDetails = getUsualItemDetails(itemName);
        if (itemDetails) {
            // Item is a usualItem, set category and skip to step3
            document.getElementById("category").value = itemDetails.category;
            showStep(3);
            // Also, set the price to the approximate price
            document.getElementById("price").value = itemDetails.price.toFixed(2);
        } else {
            showStep(2);
            // Set price to 0.00
            document.getElementById("price").value = "0.00";
        }
    } else if (currentStep === 2) {
        if (!document.getElementById("category").value) return alert("Select a category.");
        showStep(3);
        // Set price to 0.00
        document.getElementById("price").value = "0.00";
    }
}

// Add Item to List
function addItem() {
    const itemName = document.getElementById("itemName").value.trim();
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value) || 0;

    if (itemName && category) {
        if (price < 0) {
            alert("Please enter a valid price greater than or equal to zero.");
            return;
        }

        const item = {
            id: Date.now(),
            itemName,
            category,
            price
        };
        itemList.push(item);
        saveData(); // Save to localStorage
        updateUI();
        resetForm();
    }
}

function resetForm() {
    document.getElementById("add-item-form").style.display = "none";
    document.querySelectorAll(".form-step").forEach(step => step.classList.remove("active"));
    document.getElementById("itemName").value = '';
    document.getElementById("category").value = '';
    document.getElementById("price").value = '';
    document.getElementById("itemSuggestion").textContent = '';
}

function updateUI() {
    const itemListContainer = document.getElementById("item-list");
    itemListContainer.innerHTML = "";

    totalPrice = 0;

    // Group items by category
    const groupedItems = itemList.reduce((groups, item) => {
        if (!groups[item.category]) {
            groups[item.category] = [];
        }
        groups[item.category].push(item);
        return groups;
    }, {});

    // Get the sorted list of categories based on current ranking
    const sortedCategories = currentRanking ? currentRanking.categories : Object.keys(groupedItems);

    // Display items grouped and sorted by category
    sortedCategories.forEach(category => {
        if (groupedItems[category]) {
            // Create a category header
            const categoryHeader = document.createElement('h2');
            categoryHeader.textContent = category;
            itemListContainer.appendChild(categoryHeader);

            // Display each item under the category
            groupedItems[category].forEach((item) => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("item");

                itemDiv.innerHTML = `
                    <input type="text" value="${item.itemName}" readonly>
                    <span>$${item.price.toFixed(2)}</span>
                    <button onclick="removeItem(${item.id})" aria-label="Remove Item">X</button>
                `;

                totalPrice += item.price;
                itemListContainer.appendChild(itemDiv);
            });
        }
    });

    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}

function removeItem(id) {
    if (confirm("Are you sure you want to remove this item?")) {
        itemList = itemList.filter(item => item.id !== id);
        saveData(); // Save to localStorage
        updateUI();
    }
}

function shareList() {
    alert("List shared!");
}

function showSuggestion() {
    const input = document.getElementById("itemName");
    const suggestionSpan = document.getElementById("itemSuggestion");
    const inputValue = input.value.trim().toLowerCase();

    if (inputValue.length > 0) {
        // Find the first usual item that starts with the inputValue
        const suggestion = usualItems.find(item => item.toLowerCase().startsWith(inputValue));
        if (suggestion) {
            // Display the suggestion with ghost letters
            suggestionSpan.innerHTML = '<span style="opacity: 0;">' + input.value + '</span>' + suggestion.slice(input.value.length);
        } else {
            suggestionSpan.textContent = '';
        }
    } else {
        suggestionSpan.textContent = '';
    }
}

function acceptSuggestion(event) {
    const input = document.getElementById("itemName");
    const suggestionSpan = document.getElementById("itemSuggestion");

    if ((event.key === 'ArrowRight' || event.key === 'Tab') && suggestionSpan.textContent) {
        event.preventDefault();
        input.value = suggestionSpan.textContent;
        suggestionSpan.textContent = '';
    }
}

// Function to show the Category Rankings Form
function showCategoryRankings() {
    document.getElementById("category-rankings-form").style.display = "block";

    populateSelectRankingDropdown(); // Use the new function

    if (!currentRanking || !currentRanking.categories) {
        currentRanking = {
            name: "",
            categories: [...allCategories]
        };
    }

    document.getElementById("rankingName").value = currentRanking.name;
    displayCategories();
}

// **New Function to Populate selectRanking Dropdown**
function populateSelectRankingDropdown() {
    const selectRanking = document.getElementById("selectRanking");
    selectRanking.innerHTML = '<option value="">New Ranking</option>';
    categoryRankings.forEach((ranking, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = ranking.name;
        selectRanking.appendChild(option);
    });
}


// Function to load a selected ranking
function loadRanking() {
    const selectRanking = document.getElementById("selectRanking");
    const index = selectRanking.value;
    if (index !== '') {
        currentRanking = { ...categoryRankings[index] };
    } else {
        currentRanking = {
            name: "",
            categories: [...allCategories]
        };
    }
    document.getElementById("rankingName").value = currentRanking.name;
    displayCategories();
}

// Function to display categories in the current ranking
function displayCategories() {
    const categoriesList = document.getElementById("categories-list");
    categoriesList.innerHTML = '';

    // **Ensure currentRanking and categories are defined**
    if (!currentRanking || !currentRanking.categories) {
        return;
    }

    currentRanking.categories.forEach((category, index) => {
        const categoryItem = document.createElement("div");
        categoryItem.classList.add("category-item");

        categoryItem.innerHTML = `
            <span>${category}</span>
            <div>
                <button onclick="moveCategoryUp(${index})" aria-label="Move Up">↑</button>
                <button onclick="moveCategoryDown(${index})" aria-label="Move Down">↓</button>
            </div>
        `;
        categoriesList.appendChild(categoryItem);
    });
}

// Function to move a category up in the ranking
function moveCategoryUp(index) {
    if (index > 0) {
        const temp = currentRanking.categories[index];
        currentRanking.categories[index] = currentRanking.categories[index - 1];
        currentRanking.categories[index - 1] = temp;
        displayCategories();
    }
}

// Function to move a category down in the ranking
function moveCategoryDown(index) {
    if (index < currentRanking.categories.length - 1) {
        const temp = currentRanking.categories[index];
        currentRanking.categories[index] = currentRanking.categories[index + 1];
        currentRanking.categories[index + 1] = temp;
        displayCategories();
    }
}

// Function to close the Category Rankings Form
function closeCategoryRankings() {
    document.getElementById("category-rankings-form").style.display = "none";
}

// Function to delete the current ranking
// **Function to delete the current ranking**
function deleteRanking() {
    const rankingName = document.getElementById("rankingName").value.trim();

    if (!rankingName) {
        alert("No ranking selected to delete.");
        return;
    }

    // Find the index of the ranking to delete
    const index = categoryRankings.findIndex(r => r.name === rankingName);

    if (index >= 0) {
        // Confirm with the user before deleting
        if (confirm(`Are you sure you want to delete the ranking "${rankingName}"? This action cannot be undone.`)) {
            categoryRankings.splice(index, 1); // Remove the ranking from the array

            // **Reset currentRanking to a new default**
            currentRanking = {
                name: "",
                categories: [...allCategories]
            };

            // Clear the ranking name field
            document.getElementById("rankingName").value = '';

            // **Update the select dropdowns**
            populateMainRankingSelect(); // Update the main dropdown
            populateSelectRankingDropdown(); // Update the selectRanking dropdown in popup

            saveData(); // Save changes to localStorage

            displayCategories(); // Refresh the categories list

            alert(`Ranking "${rankingName}" has been deleted.`);
        }
    } else {
        alert(`Ranking "${rankingName}" not found.`);
    }
}


// Function to populate the main ranking dropdown
function populateMainRankingSelect() {
    const mainRankingSelect = document.getElementById('mainRankingSelect');
    mainRankingSelect.innerHTML = '<option value="">Select Ranking</option>';
    categoryRankings.forEach((ranking, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = ranking.name;
        mainRankingSelect.appendChild(option);
    });

    // Select the current ranking in the main dropdown
    if (currentRanking && currentRanking.name) {
        const index = categoryRankings.findIndex(r => r.name === currentRanking.name);
        if (index >= 0) {
            mainRankingSelect.value = index;
        } else {
            mainRankingSelect.value = '';
            currentRanking = {
                name: "",
                categories: [...allCategories]
            };
        }
    } else {
        mainRankingSelect.value = '';
    }
}

// Function to handle selection of a ranking from the main dropdown
function selectMainRanking() {
    const mainRankingSelect = document.getElementById('mainRankingSelect');
    const index = mainRankingSelect.value;
    if (index !== '') {
        currentRanking = { ...categoryRankings[index] };
    } else {
        // **Set currentRanking to default instead of null**
        currentRanking = {
            name: "",
            categories: [...allCategories]
        };
    }
    saveData(); // Save to localStorage
    updateUI();
}

// Modify saveRanking to update the main dropdown when a new ranking is saved
function saveRanking() {
    const rankingName = document.getElementById("rankingName").value.trim() || 'Unnamed Ranking';
    currentRanking.name = rankingName;

    // Check if a ranking with the same name already exists
    const existingIndex = categoryRankings.findIndex(r => r.name === rankingName);
    if (existingIndex >= 0) {
        // Prompt the user for confirmation before overwriting
        if (confirm(`A ranking named "${rankingName}" already exists. Do you want to overwrite it?`)) {
            categoryRankings[existingIndex] = { ...currentRanking };
        } else {
            // User chose not to overwrite
            return;
        }
    } else {
        // Add the new ranking
        categoryRankings.push({ ...currentRanking });
    }

    // Set currentRanking to the newly saved ranking
    currentRanking = { ...currentRanking };
    populateMainRankingSelect(); // Update the main dropdown

    // Select the newly saved ranking in the main dropdown
    const mainRankingSelect = document.getElementById('mainRankingSelect');
    const newIndex = categoryRankings.findIndex(r => r.name === currentRanking.name);
    if (newIndex >= 0) {
        mainRankingSelect.value = newIndex;
    }

    saveData(); // Save to localStorage

    closeCategoryRankings();
    updateUI();
}

// Call populateMainRankingSelect when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData(); // Load data from localStorage
    populateMainRankingSelect();

    // If currentRanking is set, select it in the main dropdown
    const mainRankingSelect = document.getElementById('mainRankingSelect');
    if (currentRanking && currentRanking.name) {
        const index = categoryRankings.findIndex(r => r.name === currentRanking.name);
        if (index >= 0) {
            mainRankingSelect.value = index;
        } else {
            mainRankingSelect.value = '';
            currentRanking = {
                name: "",
                categories: [...allCategories]
            };
        }
    } else {
        mainRankingSelect.value = '';
        currentRanking = {
            name: "",
            categories: [...allCategories]
        };
    }

    updateUI(); // Update the UI
});
