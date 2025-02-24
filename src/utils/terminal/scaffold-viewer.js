#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Definizione di una lista di elementi da ignorare nella visualizzazione ad albero.
const IGNORED_ITEMS = ["node_modules", ".git", ".github", ".env.example", ".DS_Store", "CHANGELOG.md", "init.sh", "README.md"];

// Funzione ricorsiva per costruire e stampare la struttura ad albero della directory specificata.
function printDirectoryTree(dirPath, prefix = "") {
    // Legge il contenuto della directory `dirPath` e filtra i file/cartelle ignorati.
    const items = fs.readdirSync(dirPath).filter((name) => {
        // Filtra gli elementi che sono nella lista di ignorati.
        return !IGNORED_ITEMS.includes(name);
    });

    // Itera su tutti gli elementi filtrati nella directory.
    items.forEach((name, index) => {
        const fullPath = path.join(dirPath, name); // Percorso completo dell'elemento corrente.
        const stats = fs.statSync(fullPath); // Ottiene i dettagli dell'elemento (file o directory).

        // Determina se l'elemento corrente è l'ultimo nella lista.
        const isLast = index === items.length - 1;

        // Crea un prefisso per l'elemento corrente basato sulla sua posizione.
        const newPrefix = prefix + (isLast ? "└── " : "├── ");
        if (stats.isDirectory()) {
            // Se l'elemento è una directory, lo stampa in blu e richiama ricorsivamente la funzione.
            console.log(chalk.blue(`${newPrefix}${name}/`));
            // Aggiunge una nuova indentazione al prefisso per i figli della directory.
            printDirectoryTree(fullPath, prefix + (isLast ? "    " : "│   "));
        } else {
            // Se l'elemento è un file, lo stampa in grigio.
            console.log(chalk.gray(`${newPrefix}${name}`));
        }
    });
}

// Punto di partenza dello script: stampa il percorso della directory corrente e avvia la funzione principale.
const currentDir = process.cwd(); // Ottiene la directory corrente di lavoro.
console.log(chalk.bold("📂 Project in: "), chalk.cyan(currentDir)); // Stampa il percorso corrente.
printDirectoryTree(currentDir); // Avvia la stampa della struttura ad albero dalla directory corrente.
console.log(" ");