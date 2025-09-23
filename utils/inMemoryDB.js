// utils/inMemoryDB.js
class InMemoryDB {
  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.submissions = new Map();
    this.counters = {
      users: 0,
      problems: 0,
      submissions: 0
    };

    this.addInitialProblems();
  }

  generateId(collection) {
    this.counters[collection]++;
    return this.counters[collection].toString();
  }

  // User Methods
  createUser(userData) {
    const id = this.generateId('users');
    const user = {
      _id: id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      solvedProblems: new Set(),
      totalSubmissions: 0,
      successfulSubmissions: 0
    };
    this.users.set(id, user);
    return user;
  }

  findUserByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.get(id);
  }

  updateUser(user) {
    if (!user || !user._id) return null;
    const updatedUser = {
      ...user,
      updatedAt: new Date()
    };
    this.users.set(user._id, updatedUser);
    return updatedUser;
  }

  // Problem Methods
  addInitialProblems() {
    const problems = [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        category: "Arrays",
        testCases: [
          {
            input: "[2,7,11,15]\n9",
            expected: "[0,1]"
          }
        ]
      },
      {
        title: "Reverse String",
        description: "Write a function that reverses a string.",
        difficulty: "Easy",
        category: "Strings",
        testCases: [
          {
            input: "hello",
            expected: "olleh"
          }
        ]
      },
      {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        difficulty: "Easy",
        category: "Stack",
        testCases: [
          {
            input: "()[]{}",
            expected: "true"
          }
        ]
      },
      {
        title: "Add Two Numbers",
        description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
        difficulty: "Medium",
        category: "Linked Lists",
        testCases: [
          {
            input: "[2,4,3]\n[5,6,4]",
            expected: "[7,0,8]"
          }
        ]
      },
      {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        category: "Strings",
        testCases: [
          {
            input: "abcabcbb",
            expected: "3"
          }
        ]
      },
      {
        title: "Merge k Sorted Lists",
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        difficulty: "Hard",
        category: "Linked Lists",
        testCases: [
          {
            input: "[[1,4,5],[1,3,4],[2,6]]",
            expected: "[1,1,2,3,4,4,5,6]"
          }
        ]
      },
      {
        title: "Binary Search",
        description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
        difficulty: "Easy",
        category: "Binary Search",
        testCases: [
          {
            input: "[-1,0,3,5,9,12]\n9",
            expected: "4"
          }
        ]
      },
      {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        difficulty: "Easy",
        category: "Dynamic Programming",
        testCases: [
          {
            input: "3",
            expected: "3"
          }
        ]
      },
      {
        title: "Maximum Subarray",
        description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
        difficulty: "Medium",
        category: "Dynamic Programming",
        testCases: [
          {
            input: "[-2,1,-3,4,-1,2,1,-5,4]",
            expected: "6"
          }
        ]
      },
      {
        title: "Regular Expression Matching",
        description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
        difficulty: "Hard",
        category: "Dynamic Programming",
        testCases: [
          {
            input: "aa\na*",
            expected: "true"
          }
        ]
      }
    ];

    problems.forEach(problem => {
      const id = this.generateId('problems');
      this.problems.set(id, {
        _id: id,
        ...problem,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }

  getAllProblems() {
    return Array.from(this.problems.values());
  }

  findProblemById(id) {
    return this.problems.get(id);
  }

  createProblem(problemData) {
    const id = this.generateId('problems');
    const problem = {
      _id: id,
      ...problemData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.problems.set(id, problem);
    return problem;
  }

  // Submission Methods
  createSubmission(submissionData) {
    const id = this.generateId('submissions');
    const submission = {
      _id: id,
      ...submissionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.submissions.set(id, submission);

    // Update user's submission stats
    if (submissionData.userId) {
      const user = this.findUserById(submissionData.userId);
      if (user) {
        user.totalSubmissions = (user.totalSubmissions || 0) + 1;
        if (submissionData.status === 'Accepted') {
          user.successfulSubmissions = (user.successfulSubmissions || 0) + 1;
          if (!user.solvedProblems) user.solvedProblems = new Set();
          user.solvedProblems.add(submissionData.problemId);
        }
        this.updateUser(user);
      }
    }

    return submission;
  }

  findSubmissionById(id) {
    return this.submissions.get(id);
  }

  getSubmissionsByUserId(userId) {
    return Array.from(this.submissions.values())
      .filter(submission => submission.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  getSubmissionsByProblemId(problemId) {
    return Array.from(this.submissions.values())
      .filter(submission => submission.problemId === problemId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  updateSubmission(submission) {
    if (!submission || !submission._id) return null;
    const updatedSubmission = {
      ...submission,
      updatedAt: new Date()
    };
    this.submissions.set(submission._id, updatedSubmission);
    return updatedSubmission;
  }

  // Leaderboard Methods
  getLeaderboard() {
    const userStats = new Map();

    // Calculate stats for each user
    for (const [userId, user] of this.users) {
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          _id: userId,
          username: user.username,
          solvedProblems: user.solvedProblems || new Set(),
          totalSubmissions: user.totalSubmissions || 0,
          successfulSubmissions: user.successfulSubmissions || 0,
          points: 0
        });
      }

      const stats = userStats.get(userId);
      if (stats.solvedProblems.size > 0) {
        // Calculate points based on solved problems
        for (const problemId of stats.solvedProblems) {
          const problem = this.findProblemById(problemId);
          if (problem) {
            stats.points += problem.difficulty === 'Hard' ? 30 :
                          problem.difficulty === 'Medium' ? 20 : 10;
          }
        }
      }
    }

    // Convert to array and sort by points
    return Array.from(userStats.values())
      .map(stats => ({
        ...stats,
        solvedProblems: Array.from(stats.solvedProblems)
      }))
      .sort((a, b) => b.points - a.points);
  }
}

// Create and export a single instance
const db = new InMemoryDB();
module.exports = db;