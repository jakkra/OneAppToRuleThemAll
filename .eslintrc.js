module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "installedESLint": true,
    "lintOnFly": true,
    "rules": {
      "no-console": 0, // ovveride disallow use of console (off by default in the node environment)
      "prefer-template": 0,
      "jsx-boolean-value": 0,
    },
    "plugins": [
        "react"
    ]
};
