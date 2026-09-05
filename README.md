# 💰 BachatDiary - Smart Finance Tracker

A modern, responsive personal finance and savings tracker designed for students and young earners in India.

## 🌟 Features

### 1. **Dashboard**
- Real-time display of total balance, expenses, and savings
- Monthly spending summary with interactive donut chart
- Recent transactions list with quick delete option
- Visual metric cards with beautiful icons

### 2. **Add Expense**
- Simple form to track expenses
- Multiple categories (Food, Travel, Shopping, Entertainment, Utilities, Education, Health, Other)
- Date picker for precise expense tracking
- Optional description for each expense
- Real-time round-up preview

### 3. **Smart Round-Up Savings** ✨
- Automatically round up expenses to nearest ₹100
- Save the difference automatically
- Example: Spend ₹180 → Round to ₹200 → Save ₹20
- Track total auto-saved amount separately
- Toggle round-up on/off for each expense

### 4. **Smart Savings Goals**
- Set custom savings targets (e.g., "Trip ₹10,000", "Laptop ₹50,000")
- Visual progress bars showing goal completion percentage
- Track progress towards multiple goals simultaneously
- Delete goals anytime

### 5. **AI-Like Insights**
- Automatic analysis of spending patterns
- Top spending category identification
- Total amount saved through round-ups
- Average transaction amounts
- Goal progress tracking
- Category breakdown with visual bars

### 6. **Dark Mode** 🌙
- Toggle dark mode with one click
- Preference saved automatically
- Smooth transitions between themes
- Easy on the eyes during night browsing

### 7. **Data Persistence**
- All data stored locally in browser (localStorage)
- No backend needed
- Data persists across browser refreshes
- Private and secure - no data sent to servers

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation and multi-column layouts
- **Tablet**: Optimized spacing and readable text
- **Mobile**: Compact sidebar converted to horizontal navbar, single-column layouts
- Touch-friendly buttons and inputs

## 🚀 Getting Started

### How to Run

1. **Save the files** in a folder:
   - `index.html`
   - `style.css`
   - `script.js`

2. **Open in browser**:
   - Double-click `index.html`
   - Or right-click → "Open with" → Select your browser
   - Or drag and drop into your browser window

3. **Start using**:
   - Navigate using the sidebar menu
   - Add your first expense
   - Watch your savings grow automatically!

## 📚 How to Use

### Adding an Expense

1. Click **"➕ Add Expense"** in the sidebar
2. Enter the expense amount in rupees
3. Select the category (Food, Travel, etc.)
4. Pick the date of the expense
5. Add an optional description
6. Toggle "Enable Smart Round-up Savings" (default: ON)
7. Click **"Add Expense"**
8. See your auto-saved amount increase! ✨

### Creating a Savings Goal

1. Click **"🎯 Goals"** in the sidebar
2. Enter goal name (e.g., "Laptop", "Trip to Goa")
3. Enter target amount in rupees
4. Click **"Create Goal"**
5. Track your progress as you add expenses

### Viewing Insights

1. Click **"💡 Insights"** in the sidebar
2. See personalized insights about your spending
3. View spending breakdown by category
4. Identify spending patterns

### Using Dark Mode

1. Click the **🌙** icon in the sidebar header
2. Your preference is automatically saved
3. Switch back anytime with the **☀️** icon

## 🎯 Smart Features Explained

### How Round-Up Savings Works

```
Expense Added: ₹180
Rounded Amount: ₹200 (nearest ₹100)
Auto Saved: ₹20 ✨

This money is automatically set aside as savings!
```

### Monthly Insights

The app analyzes your spending to provide:
- **Top Spending Category**: Which category you spend most on
- **Auto Saved Amount**: Total money saved through round-ups
- **Average Transaction**: Your typical expense amount
- **Goal Progress**: How close you are to your savings targets

## 💾 Data Management

**Your data is stored locally in your browser using localStorage:**

- No internet connection needed after loading
- 100% private - nothing goes to a server
- Data survives browser refresh
- Clearing browser cache will delete data

### Backing Up Your Data

Your data structure (you can save this if you want):
```javascript
{
  expenses: [
    {
      id: timestamp,
      amount: number,
      category: string,
      date: date,
      description: string,
      roundupAmount: number,
      enableRoundup: boolean
    }
  ],
  goals: [
    {
      id: timestamp,
      name: string,
      target: number,
      created: timestamp
    }
  ],
  autoSaved: number
}
```

## 🎨 Design Features

- **Color Scheme**: Modern blue and white theme
- **Typography**: Clean, professional fonts
- **Animations**: Smooth transitions and hover effects
- **Icons**: Emoji icons for visual clarity
- **Cards**: Modern card-based UI with shadows and depth
- **Responsive**: Works on all devices from mobile to desktop

## 🔧 Technical Stack

- **HTML5**: Semantic markup and forms
- **CSS3**: Grid, Flexbox, CSS custom properties, dark mode
- **Vanilla JavaScript**: No frameworks, lightweight (~500 lines)
- **Chart.js**: For spending visualization
- **localStorage**: Browser-based data persistence

## 💡 Tips for Best Experience

1. **Use Categories**: Choose appropriate categories for better insights
2. **Add Descriptions**: Makes it easier to remember expenses later
3. **Set Realistic Goals**: Create achievable savings targets
4. **Regular Check-ins**: Visit the Insights page weekly
5. **Review Monthly**: Look at your dashboard each month for patterns

## 📊 Example Workflow

**Day 1**: 
- Add expense: ₹180 for lunch (Food)
- Auto-save: ₹20
- Total Savings: ₹20

**Day 2**:
- Add expense: ₹245 for bus pass (Travel)
- Auto-save: ₹55
- Total Savings: ₹75

**Day 3**:
- Create goal: "Movie Night ₹500"
- Expenses accumulate, savings grow
- Progress bar fills automatically

## 🐛 Troubleshooting

**Data not saving?**
- Check if localStorage is enabled in browser settings
- Try in incognito/private mode
- Clear browser cache and reload

**Chart not showing?**
- Ensure Chart.js CDN is accessible
- Check browser console for errors
- Try refreshing the page

**Dark mode not working?**
- Refresh the page
- Check browser console for errors
- Try switching modes again

## 🚀 Future Enhancements

Possible features to add:
- Export data as CSV
- Recurring expenses
- Budget limits with alerts
- Monthly comparison charts
- Expense search and filter
- Multiple user profiles
- Cloud backup option
- Mobile app version

## 📝 Code Comments

All functions are well-commented for beginners:
- Section headers explain code organization
- Function comments explain purpose and parameters
- Inline comments explain complex logic

## 👨‍💻 For Beginners

If you're new to web development:

1. **HTML** (`index.html`): Structure of the app
2. **CSS** (`style.css`): Look and feel
3. **JavaScript** (`script.js`): Functionality and logic

Try modifying:
- Colors in CSS variables (top of `style.css`)
- Category emojis (in `getCategoryInfo()` function)
- Add new features following the existing patterns

## 📄 License

This is a free, open-source educational project. Use, modify, and share freely!

---

## 🎉 Enjoy BachatDiary!

Start tracking your expenses, save money smartly, and achieve your financial goals. Happy saving! 💚

**Made with ❤️ for students and young earners in India**
