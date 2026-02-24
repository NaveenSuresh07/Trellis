export const courseData = {
    html: {
        title: "HTML Basics",
        language: "html",
        sections: [
            {
                id: 1,
                title: "Fundamentals",
                description: "Build a strong foundation with essential concepts and basic skills",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Introduction to HTML",
                        content: "HTML (HyperText Markup Language) is the backbone of every website. It uses tags to structure content like headings, paragraphs, and links.",
                        challenge: "Let's start by identifying a heading! Change the text to 'Hello Trellis!'.",
                        instructions: [
                            "Change the text inside the `<h1>` tag.",
                            "Press 'Run Code' to verify."
                        ],
                        initialCode: "<h1>Hello World!</h1>",
                        solution: "<h1>Hello Trellis!</h1>",
                        expectedOutput: "Hello Trellis!"
                    },
                    {
                        id: 2,
                        type: "quiz",
                        title: "The HTML Structure",
                        content: "Every HTML document follows a strict hierarchy. The `<html>` tag is the root, containing `<head>` for metadata and `<body>` for visible content.",
                        challenge: "Which tag contains the visible content of a webpage?",
                        options: ["<head>", "<body>", "<title>", "<html>"],
                        correctAnswer: 1, // <body>
                        expectedOutput: "Correct! The body tag contains everything you see."
                    },
                    {
                        id: 3,
                        type: "blank",
                        title: "Tags and Elements",
                        content: "Paragraphs are defined with the `<p>` tag. Always remember to close your tags!",
                        challenge: "Complete the paragraph element below.",
                        template: "<p>Learning HTML is ___ </p>",
                        correctAnswers: ["fun"],
                        expectedOutput: "Perfect! You've mastered the paragraph tag."
                    }
                ]
            },
            {
                id: 2,
                title: "Advanced Layout",
                description: "Master CSS structure and positioning",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Intro to CSS",
                        content: "CSS is used to style HTML. You can change colors, fonts, and layouts.",
                        challenge: "Set the background color of the body to 'blue'.",
                        instructions: [
                            "Use the `style` tag.",
                            "Set `body { background-color: blue; }`"
                        ],
                        initialCode: "<body>\n  <h1>My Site</h1>\n</body>",
                        solution: "<body style=\"background-color: blue;\">\n  <h1>My Site</h1>\n</body>",
                        expectedOutput: "blue"
                    }
                ]
            },
            {
                id: 3,
                title: "Forms & Inputs",
                description: "Learn how to collect user data using forms",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Input Elements",
                        content: "Forms use the `<input>` tag to gather information like text, passwords, and emails.",
                        challenge: "Create a text input field.",
                        instructions: [
                            "Add an `<input type=\"text\">` tag.",
                            "Give it a placeholder 'Enter Name'."
                        ],
                        initialCode: "<form>\n  <!-- Add input here -->\n</form>",
                        solution: "<form>\n  <input type=\"text\" placeholder=\"Enter Name\">\n</form>",
                        expectedOutput: "Enter Name"
                    }
                ]
            },
            {
                id: 4,
                title: "Semantic HTML",
                description: "Structure your web pages for better accessibility and SEO",
                lessons: [
                    {
                        id: 1,
                        type: "quiz",
                        title: "Semantic Tags",
                        content: "Semantic tags like `<header>`, `<footer>`, and `<article>` describe their meaning to both the browser and the developer.",
                        challenge: "Which tag should be used for the main navigation links?",
                        options: ["<nav>", "<div>", "<links>", "<menu>"],
                        correctAnswer: 0,
                        expectedOutput: "Correct! The nav tag is for navigation links."
                    }
                ]
            }
        ]
    },
    python: {
        title: "Python Essentials",
        language: "python",
        sections: [
            {
                id: 1,
                title: "Fundamentals",
                description: "Build a strong foundation with essential concepts and basic skills",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Introduction to Python",
                        content: "Python is one of the world's easiest and most popular programming languages. It's known for its clean syntax and readability.",
                        challenge: "Welcome to your first Python program! Use the `print()` function to output text.",
                        instructions: [
                            "Write a line that prints 'Hello Python!'",
                            "Press the 'Run Code' button to execute it"
                        ],
                        initialCode: "# Your code here",
                        solution: "print(\"Hello Python!\")",
                        expectedOutput: "Hello Python!"
                    },
                    {
                        id: 2,
                        type: "coding",
                        title: "Variables",
                        content: "Variables are containers for storing data values. In Python, you create a variable by assigning a value to it.",
                        challenge: "Create a variable named `score` and give it the value `100`.",
                        instructions: [
                            "Define `score = 100`",
                            "Print the variable `score`."
                        ],
                        initialCode: "score = 0\n# Update score here\nprint(score)",
                        solution: "score = 100\nprint(score)",
                        expectedOutput: "100"
                    }
                ]
            },
            {
                id: 2,
                title: "Control Flow",
                description: "Master logic and decision making in Python",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "If Statements",
                        content: "Control flow allows your program to make decisions based on conditions.",
                        challenge: "Complete the if statement to print 'Winner' if the variable `score` is 100.",
                        instructions: [
                            "Use `if score == 100:`",
                            "Indent your print statement correctly."
                        ],
                        initialCode: "score = 100\n# Write if here\n",
                        solution: "score = 100\nif score == 100:\n    print(\"Winner\")",
                        expectedOutput: "Winner"
                    }
                ]
            },
            {
                id: 3,
                title: "Functions & Modules",
                description: "Organize your code into reusable blocks",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Defining Functions",
                        content: "Functions are defined using the `def` keyword. They help avoid repeating code.",
                        challenge: "Define a function named `greet` that prints 'Hi'.",
                        instructions: [
                            "Use `def greet():`",
                            "Print 'Hi' inside."
                        ],
                        initialCode: "# Define here\n\ngreet()",
                        solution: "def greet():\n    print(\"Hi\")\n\ngreet()",
                        expectedOutput: "Hi"
                    }
                ]
            },
            {
                id: 4,
                title: "Data Structures",
                description: "Store and manipulate collections of data in Lists and Dictionaries",
                lessons: [
                    {
                        id: 1,
                        type: "blank",
                        title: "Python Lists",
                        content: "Lists are used to store multiple items in a single variable. They are ordered and changeable.",
                        challenge: "Complete the list definition.",
                        template: "fruits = [\"apple\", \"___ \", \"cherry\"]",
                        correctAnswers: ["banana"],
                        expectedOutput: "Correct! Banana is in the list."
                    }
                ]
            }
        ]
    },
    javascript: {
        title: "JavaScript Core",
        language: "javascript",
        sections: [
            {
                id: 1,
                title: "Fundamentals",
                description: "Learn the core syntax and basic building blocks of JavaScript",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "JS Fundamentals",
                        content: "JavaScript is the programming language of the Web. It is easy to learn and powerful.",
                        challenge: "Let's perform a simple sum in JavaScript.",
                        instructions: [
                            "Change the value of `b` to `10`.",
                            "The expected output should be `15`."
                        ],
                        initialCode: "const a = 5;\nconst b = 0;\nconsole.log(a + b);",
                        solution: "const a = 5;\nconst b = 10;\nconsole.log(a + b);",
                        expectedOutput: "15"
                    },
                    {
                        id: 2,
                        type: "coding",
                        title: "Arrays",
                        content: "Arrays are used to store multiple values in a single variable. You access them using numbers (indices).",
                        challenge: "Access the second element of the array.",
                        instructions: [
                            "Print the element at index `1` of the `fruit` array.",
                            "Use `console.log()`."
                        ],
                        initialCode: "const fruits = ['Apple', 'Banana', 'Cherry'];\n// console.log here",
                        solution: "const fruits = ['Apple', 'Banana', 'Cherry'];\nconsole.log(fruits[1]);",
                        expectedOutput: "Banana"
                    }
                ]
            },
            {
                id: 2,
                title: "Control Flow",
                description: "Master logic and decision making in JavaScript",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "If Statements",
                        content: "The if statement is used to perform different actions based on different conditions.",
                        challenge: "Write an if statement that prints 'Pass' if the score is 50 or higher.",
                        instructions: [
                            "Set `const score = 75;`",
                            "Check if `score >= 50`.",
                            "Print 'Pass' using `console.log()`."
                        ],
                        initialCode: "const score = 75;\n// Check here\n",
                        solution: "const score = 75;\nif (score >= 50) {\n    console.log('Pass');\n}",
                        expectedOutput: "Pass"
                    }
                ]
            },
            {
                id: 3,
                title: "Functions & Scope",
                description: "Learn how to wrap code into reusable functions",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Arrow Functions",
                        content: "Arrow functions provide a concise syntax for writing function expressions.",
                        challenge: "Create an arrow function `sayHi` that returns 'Hi'.",
                        instructions: [
                            "Use `const sayHi = () => 'Hi';`",
                            "Log the result."
                        ],
                        initialCode: "// Write here\nconsole.log(sayHi());",
                        solution: "const sayHi = () => 'Hi';\nconsole.log(sayHi());",
                        expectedOutput: "Hi"
                    }
                ]
            },
            {
                id: 4,
                title: "Async JavaScript",
                description: "Handle asynchronous operations with Promises and Async/Await",
                lessons: [
                    {
                        id: 1,
                        type: "quiz",
                        title: "Promises",
                        content: "A Promise is an object representing the eventual completion or failure of an asynchronous operation.",
                        challenge: "Which keyword is used to wait for a Promise to resolve?",
                        options: ["wait", "await", "defer", "promise"],
                        correctAnswer: 1,
                        expectedOutput: "Correct! await pauses execution until the promise settles."
                    }
                ]
            }
        ]
    },
    java: {
        title: "Java Programming",
        language: "java",
        sections: [
            {
                id: 1,
                title: "Fundamentals",
                description: "Introduction to Java syntax, compiling, and running programs",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Java Fundamentals",
                        content: "Java is a powerful general-purpose programming language. It is used to develop desktop and mobile applications.",
                        challenge: "Let's print a greeting in Java.",
                        instructions: [
                            "Complete the code to print 'Hello Trellis!'.",
                            "Remember to use `System.out.println()`."
                        ],
                        initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
                        solution: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Trellis!\");\n    }\n}",
                        expectedOutput: "Hello Trellis!"
                    },
                    {
                        id: 2,
                        type: "coding",
                        title: "Integers",
                        content: "In Java, `int` is used for whole numbers.",
                        challenge: "Create an integer `count` with value `5`.",
                        instructions: [
                            "Declare `int count = 5;`",
                            "Print it using `System.out.println(count);`"
                        ],
                        initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Declare count here\n    }\n}",
                        solution: "public class Main {\n    public static void main(String[] args) {\n        int count = 5;\n        System.out.println(count);\n    }\n}",
                        expectedOutput: "5"
                    }
                ]
            },
            {
                id: 2,
                title: "Control Flow",
                description: "Conditions and decision making in Java",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "If Else",
                        content: "Java uses standard logical conditions to compare values and control program flow.",
                        challenge: "Check if `age` is 18 or older.",
                        instructions: [
                            "Declare `int age = 20;`",
                            "If `age >= 18`, print 'Adult'."
                        ],
                        initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
                        solution: "public class Main {\n    public static void main(String[] args) {\n        int age = 20;\n        if (age >= 18) {\n            System.out.println(\"Adult\");\n        }\n    }\n}",
                        expectedOutput: "Adult"
                    }
                ]
            },
            {
                id: 3,
                title: "Classes & Objects",
                description: "Master the basics of Object-Oriented Programming (OOP)",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Classes",
                        content: "In Java, everything is grouped into classes. An object is an instance of a class.",
                        challenge: "Create a class and define a main method.",
                        instructions: [
                            "Write `public class Solution {}`",
                            "Everything in Java needs a class!"
                        ],
                        initialCode: "// Start here",
                        solution: "public class Solution {\n    public static void main(String[] args) {\n        System.out.println(\"Class Created\");\n    }\n}",
                        expectedOutput: "Class Created"
                    }
                ]
            },
            {
                id: 4,
                title: "Inheritance",
                description: "Learn how to reuse code between classes",
                lessons: [
                    {
                        id: 1,
                        type: "quiz",
                        title: "Inheritance Basics",
                        content: "Inheritance allows one class to acquire the properties and methods of another class.",
                        challenge: "Which keyword is used for inheritance in Java?",
                        options: ["implements", "extends", "inherits", "using"],
                        correctAnswer: 1,
                        expectedOutput: "Correct! The extends keyword is used for inheritance."
                    }
                ]
            }
        ]
    },
    c: {
        title: "C Fundamentals",
        language: "c",
        sections: [
            {
                id: 1,
                title: "Basics",
                description: "C syntax, data types, and compiled language basics",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Introduction to C",
                        content: "C is a powerful general-purpose programming language. It can be used to develop operating systems and databases.",
                        challenge: "Let's print 'C is cool!' in C.",
                        instructions: [
                            "Complete the `printf` statement.",
                            "Make sure to include a newline `\\n`."
                        ],
                        initialCode: "#include <stdio.h>\n\nint main() {\n    // printf here\n    return 0;\n}",
                        solution: "#include <stdio.h>\n\nint main() {\n    printf(\"C is cool!\\n\");\n    return 0;\n}",
                        expectedOutput: "C is cool!"
                    },
                    {
                        id: 2,
                        type: "coding",
                        title: "Return Values",
                        content: "The `main` function in C returns an integer. `0` usually means success.",
                        challenge: "Ensure the program returns `0`.",
                        instructions: [
                            "Add `return 0;` at the end of the `main` function."
                        ],
                        initialCode: "#include <stdio.h>\n\nint main() {\n    printf(\"Success\\n\");\n    // return here\n}",
                        solution: "#include <stdio.h>\n\nint main() {\n    printf(\"Success\\n\");\n    return 0;\n}",
                        expectedOutput: "Success"
                    }
                ]
            },
            {
                id: 2,
                title: "Logic",
                description: "Conditions and Boolean logic in C",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "If Statements",
                        content: "C uses if statements to control the execution of code based on conditions.",
                        challenge: "Check if the variable `num` is positive.",
                        instructions: [
                            "Declare `int num = 10;`",
                            "If `num > 0`, print 'Positive'."
                        ],
                        initialCode: "#include <stdio.h>\n\nint main() {\n    // Code here\n    return 0;\n}",
                        solution: "#include <stdio.h>\n\nint main() {\n    int num = 10;\n    if (num > 0) {\n        printf(\"Positive\\n\");\n    }\n    return 0;\n}",
                        expectedOutput: "Positive"
                    }
                ]
            },
            {
                id: 3,
                title: "Pointers & Memory",
                description: "Master direct memory management in C",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Pointers",
                        content: "A pointer is a variable that stores the memory address of another variable.",
                        challenge: "Create a pointer `p` that points to `x`.",
                        instructions: [
                            "Use `int *p = &x;`",
                            "Print the value of `*p`."
                        ],
                        initialCode: "int x = 42;\n// Write pointer here",
                        solution: "int x = 42;\nint *p = &x;\nprintf(\"%d\", *p);",
                        expectedOutput: "42"
                    }
                ]
            },
            {
                id: 4,
                title: "Structs",
                description: "Define custom data types in C",
                lessons: [
                    {
                        id: 1,
                        type: "blank",
                        title: "C Structs",
                        content: "A struct is a user-defined data type in C that allows you to combine different data types.",
                        challenge: "Complete the struct definition.",
                        template: "struct ___ { int id; };",
                        correctAnswers: ["User"],
                        expectedOutput: "Correct! The struct name is User."
                    }
                ]
            }
        ]
    },
    sql: {
        title: "SQL Mastery",
        language: "sql",
        sections: [
            {
                id: 1,
                title: "Relational Queries",
                description: "Understand database schemas and write basic select statements",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "Relational Databases",
                        content: "SQL (Structured Query Language) is used to communicate with a database.",
                        challenge: "Let's select all records from a table named 'Users'.",
                        instructions: [
                            "Write the query: `SELECT * FROM Users;`",
                            "End your query with a semicolon."
                        ],
                        initialCode: "# Your query here",
                        solution: "SELECT * FROM Users;",
                        expectedOutput: "Displaying all users."
                    },
                    {
                        id: 2,
                        type: "coding",
                        title: "Filtering Data",
                        content: "The `WHERE` clause is used to filter records.",
                        challenge: "Find users with ID 1.",
                        instructions: [
                            "Use `SELECT * FROM Users WHERE id = 1;`."
                        ],
                        initialCode: "SELECT * FROM Users",
                        solution: "SELECT * FROM Users WHERE id = 1;",
                        expectedOutput: "User with ID 1 found."
                    }
                ]
            },
            {
                id: 2,
                title: "Filtering Results",
                description: "Using the WHERE clause and operators",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "The WHERE Clause",
                        content: "The WHERE clause is used to extract only those records that fulfill a specified condition.",
                        challenge: "Select all users from India.",
                        instructions: [
                            "Query: `SELECT * FROM Users WHERE country = 'India';`"
                        ],
                        initialCode: "-- Your query",
                        solution: "SELECT * FROM Users WHERE country = 'India';",
                        expectedOutput: "Users from India found."
                    }
                ]
            },
            {
                id: 3,
                title: "Aggregations",
                description: "Use aggregate functions to calculate data",
                lessons: [
                    {
                        id: 1,
                        type: "coding",
                        title: "COUNT Function",
                        content: "The COUNT() function returns the number of rows that matches a specified criterion.",
                        challenge: "Count the total number of users.",
                        instructions: [
                            "Use `SELECT COUNT(*) FROM Users;`"
                        ],
                        initialCode: "-- Count here",
                        solution: "SELECT COUNT(*) FROM Users;",
                        expectedOutput: "5"
                    }
                ]
            },
            {
                id: 4,
                title: "Joins Basics",
                description: "Combine rows from two or more tables",
                lessons: [
                    {
                        id: 1,
                        type: "quiz",
                        title: "Inner Join",
                        content: "An INNER JOIN selects records that have matching values in both tables.",
                        challenge: "Which keyword combines tables based on a related column?",
                        options: ["MERGE", "JOIN", "COMBINE", "LINK"],
                        correctAnswer: 1,
                        expectedOutput: "Correct! JOIN is used to combine tables."
                    }
                ]
            }
        ]
    }
};
