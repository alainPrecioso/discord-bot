const userHistories = {};

function saveUserHistory(userId, role, username, content) {
    if (!userHistories[userId]) {
        userHistories[userId] = [];
    }

    const newEntry = {
        role: role,
        name: username,
        content: content,
    };

    const history = userHistories[userId];
    const lastEntry = history[history.length - 1];
    const secondLastEntry = history[history.length - 2];

    const isDuplicate = (entry1, entry2) => {
        return entry1 && entry2 &&
            entry1.role === entry2.role &&
            entry1.name === entry2.name &&
            entry1.content === entry2.content;
    };

    if (!(isDuplicate(lastEntry, newEntry) || isDuplicate(secondLastEntry, newEntry))) {
        userHistories[userId].push(newEntry);
    }

    if (userHistories[userId].length > 10) {
        userHistories[userId].splice(0, userHistories[userId].length - 10);
    }
}

module.exports = { userHistories, saveUserHistory };