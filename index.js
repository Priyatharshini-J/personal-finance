import express from 'express'
import catalyst from "zcatalyst-sdk-node";

const app = express();
app.use(express.json());

let mainPort = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 4000;
app.listen(mainPort, async (err) => {
    if (err) {
        console.log(err);
        process.exit();
    }
    console.log("listening");
})

app.get("/getTransactions", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const userId = req.query.userId;
        let query = `Select * from Transactions where Transactions.userId = ${userId} OR userId IS NULL`;
        let result = await catalystApp.zcql().executeZCQLQuery(query);
        let finalData = [];
        for (let i = 0; i < result.length; i++) {
            let data = result[i]['Transactions'];
            finalData.push(data);
        }
        res.status(200).json({ finalData });
    } catch (err) {
        console.log("Error in getTransactions >>> " + err);
        res.status(500).send({
            message: "Internal Server Error in Getting User Details. Please try again after sometime.",
            error: err,
        });
    }
})

app.get("/getBudgetCategories", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const userId = req.query.userId;
        let query = `Select * from BudgetCategory where (budgeted is not null or budgeted != 0) and (userId = '12130000056311372' OR userId IS NULL)`;
        let result = await catalystApp.zcql().executeZCQLQuery(query);
        let finalData = [];
        for (let i = 0; i < result.length; i++) {
            let data = result[i]['BudgetCategory'];
            finalData.push(data);
        }
        res.status(200).json({ finalData });
    } catch (err) {
        console.log("Error in getBudgetCategories >>> " + err);
        res.status(500).send({
            message: "Internal Server Error in Getting User Details. Please try again after sometime.",
            error: err,
        });
    }
})

app.get("/getCategories", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const userId = req.query.userId;
        let query = `Select * from BudgetCategory where userId = ${userId} OR userId IS NULL`;
        let result = await catalystApp.zcql().executeZCQLQuery(query);
        let finalData = [];
        for (let i = 0; i < result.length; i++) {
            let data = result[i]['BudgetCategory'];
            finalData.push(data);
        }
        res.status(200).json({ finalData });
    } catch (err) {
        console.log("Error in getBudgetCategories >>> " + err);
        res.status(500).send({
            message: "Internal Server Error in Getting User Details. Please try again after sometime.",
            error: err,
        });
    }
})

app.get("/getSavingsGoal", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const userId = req.query.userId;
        let query = `Select * from SavingsGoal where SavingsGoal.userId = ${userId} OR userId IS NULL`;
        let result = await catalystApp.zcql().executeZCQLQuery(query);
        let finalData = [];
        for (let i = 0; i < result.length; i++) {
            let data = result[i]['SavingsGoal'];
            finalData.push(data);
        }
        res.status(200).json({ finalData });

    } catch (err) {
        console.log("Error in getSavingsGoal >>> " + err);
        res.status(500).send({
            message: "Internal Server Error in Getting User Details. Please try again after sometime.",
            error: err,
        });
    }
})

app.get("/getMonthlyOverview", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const userId = req.query.userId;
        let query = `Select * from MonthlyOverview where MonthlyOverview.userId = ${userId} OR userId IS NULL`;
        let result = await catalystApp.zcql().executeZCQLQuery(query);
        let finalData = [];
        for (let i = 0; i < result.length; i++) {
            let data = result[i]['MonthlyOverview'];
            finalData.push(data);
        }
        res.status(200).json({ finalData });
    } catch (err) {
        console.log("Error in getMonthlyOverview >>> " + err);
        res.status(500).send({
            message: "Internal Server Error in Getting User Details. Please try again after sometime.",
            error: err,
        });
    }
})

app.post("/addTransaction", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const { transactionDate, Description, Category, Amount, Type, userId } = req.body;
        const catalystTable = catalystApp.datastore().table("Transactions");
        const response = await catalystTable.insertRow({
            transactionDate, Description, Category, Amount, Type, userId
        });
        res.status(200).send({ message: `Transaction added successfully!!!.`, transactionId: response.ROWID });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.put("/editTransaction", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const updateData = req.body;
        const catalystTable = catalystApp.datastore().table("Transactions");
        const response = await catalystTable.updateRow({
            userId: updateData.userId,
            Type: updateData.Type,
            Amount: updateData.Amount,
            Category: updateData.Category,
            Description: updateData.Description,
            transactionDate: updateData.transactionDate,
            ROWID: updateData.ROWID
        });
        res.status(200).send({ message: `Transaction edited successfully!!!.` });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.delete("/deleteTransaction/:id", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const ROWID = req.params.id;
        const catalystTable = catalystApp.datastore().table("Transactions");
        await catalystTable.deleteRow(ROWID)
        res.status(200).send({ message: `Transaction deleted successfully!!!.` });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.post("/addBudgetCategory", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const { name, budgeted, spent, color, userId } = req.body;
        const catalystTable = catalystApp.datastore().table("BudgetCategory");
        const response = await catalystTable.insertRow({
            name, budgeted, spent, color, userId
        });
        res.status(200).send({ message: `Category added successfully!!!.`, transactionId: response.ROWID });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.put("/editBudgetCategory", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const updateData = req.body;
        const catalystTable = catalystApp.datastore().table("BudgetCategory");
        const response = await catalystTable.updateRow({
            userId: updateData.userId,
            budgeted: updateData.budgeted,
            spent: updateData.spent,
            color: updateData.color,
            ROWID: updateData.ROWID
        });
        res.status(200).send({ message: `Category edited successfully!!!.` });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.delete("/deleteBudgetCategory/:id", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const ROWID = req.params.id;
        const catalystTable = catalystApp.datastore().table("BudgetCategory");
        await catalystTable.deleteRow(ROWID)
        res.status(200).send({ message: `Category deleted successfully!!!.` });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.post("/addSavingsGoal", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const { name, targetAmount, currentAmount, targetDate, color, userId } = req.body;
        const catalystTable = catalystApp.datastore().table("SavingsGoal");
        const response = await catalystTable.insertRow({
            name, targetAmount, currentAmount, targetDate, color, userId
        });
        res.status(200).send({ message: `Goal added successfully!!!.`, transactionId: response.ROWID });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.put("/editSavingsGoal", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const updateData = req.body;
        const catalystTable = catalystApp.datastore().table("SavingsGoal");
        const response = await catalystTable.updateRow({
            userId: updateData.userId,
            name: updateData.name,
            targetAmount: updateData.targetAmount,
            currentAmount: updateData.currentAmount,
            targetDate: updateData.targetDate,
            color: updateData.color,
            ROWID: updateData.ROWID
        });
        res.status(200).send({ message: `Goal edited successfully!!!.` });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});

app.delete("/deleteSavingsGoal/:id", async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const ROWID = req.params.id;
        const catalystTable = catalystApp.datastore().table("SavingsGoal");
        await catalystTable.deleteRow(ROWID)
        res.status(200).send({ message: `Goal deleted successfully!!!.` });
    } catch (err) {
        console.log(`Error in checkout >>> ` + err);
        res.status(500).send({
            message: "Internal Server Error. Please try again after sometime.",
            error: err
        });
    }
});