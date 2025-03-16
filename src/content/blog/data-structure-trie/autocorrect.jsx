"use client";

import React, { useEffect } from 'react';
import * as d3 from "d3";

const AutocorrectComponent = () => {
    useEffect(() => {
        // Initialize words
        const palabrasEjemplo = [
            'aguila', 'antilope', 'ardilla', 'armadillo', 'ballena',
            'bufalo', 'buho', 'caballo', 'cabra', 'camello',
            'canguro', 'camaleon', 'cebra', 'chimpance', 'cocodrilo',
            'colibri', 'conejo', 'delfin', 'elefante', 'flamenco',
            'foca', 'gallina', 'gato', 'gaviota', 'gorila',
            'guepardo', 'hamster', 'hipopotamo', 'hiena', 'iguana',
            'jaguar', 'jirafa', 'koala', 'lagarto', 'leon',
            'leopardo', 'llama', 'lobo', 'loro', 'mapache',
            'medusa', 'mono', 'murcielago', 'nutria', 'oso',
            'panda', 'pantera', 'pato', 'pavo', 'pelicano',
            'perro', 'pinguino', 'pulpo', 'puma', 'raton',
            'rinoceronte', 'salamandra', 'serpiente', 'tapir', 'tigre',
            'tiburon', 'tortuga', 'tucan', 'vaca', 'vicuña',
            'zorro', 'abeja', 'albatros', 'anaconda', 'anguila',
            'anoplocefalo', 'antena', 'asno', 'atun', 'avispon',
            'babirusa', 'bagre', 'barracuda', 'berrendo', 'bisonte',
            'boqueron', 'buey', 'cabra montes', 'calamar', 'caracol',
            'carpa', 'cascabel', 'castor', 'ciervo', 'cisne',
            'comadreja', 'coral', 'correcaminos', 'cuervo', 'culebra',
            'cururo', 'degu', 'dragon de komodo', 'dromedario', 'dugongo',
            'elasmobraquio', 'erizo', 'escarabajo', 'estrella de mar', 'fasianido',
            'felino', 'foton', 'frailecillo', 'gacela', 'galgo',
            'garceta', 'gato montes', 'gavilan', 'gibón', 'golondrina',
            'grillo', 'guanaco', 'guacamayo', 'herrerillo', 'hormiga',
            'huron', 'isopodo', 'jilguero', 'lamprea', 'langosta',
            'lechuza', 'lince', 'lobo marino', 'mamut', 'mangosta',
            'manati', 'mantarraya', 'mariposa', 'marmota', 'martin pescador',
            'mofeta', 'mojarra', 'molusco', 'monstruo de gila', 'mochuelo',
            'narval', 'navaja', 'orca', 'orangutan', 'ornitorrinco',
            'oso polar', 'oso hormiguero', 'paloma', 'palometon', 'panda rojo',
            'pangolin', 'pato real', 'pavon', 'pecari', 'pejelagarto',
            'pez espada', 'pez globo', 'pez payaso', 'pez volador', 'pingüino emperador',
            'polilla', 'quokka', 'quetzal', 'rana', 'sapo', 'solenodon', 'tarantula', 'tejon',
            'tenrec', 'termitas', 'tigre blanco', 'tilapia', 'topo',
            'toro', 'triton', 'tuna', 'urubu', 
            'urraca', 'vampiro', 'venado', 'verdin', 'vicuna',
            'wombat', 'xenopus', 'yacaré', 'yak', 'zancudo',
            'zarigueya', 'zorrillo', 'rata'
        ];

        // Implementación de la clase Trie
        class TrieNode {
            constructor() {
                this.children = {};
                this.isEndOfWord = false;
            }
        }

        class Trie {
            constructor() {
                this.root = new TrieNode();
            }

            insert(word) {
                let current = this.root;
                for (let char of word) {
                    if (!current.children[char]) {
                        current.children[char] = new TrieNode();
                    }
                    current = current.children[char];
                }
                current.isEndOfWord = true;
            }

            search(word) {
                let current = this.root;
                for (let char of word) {
                    if (!current.children[char]) {
                        return false;
                    }
                    current = current.children[char];
                }
                return current.isEndOfWord;
            }

            // Calcula la distancia de Levenshtein entre dos palabras
            levenshteinDistance(word1, word2) {
                const matrix = Array(word2.length + 1).fill().map(() => 
                    Array(word1.length + 1).fill(0)
                );

                for (let i = 0; i <= word1.length; i++) {
                    matrix[0][i] = i;
                }
                for (let j = 0; j <= word2.length; j++) {
                    matrix[j][0] = j;
                }

                for (let j = 1; j <= word2.length; j++) {
                    for (let i = 1; i <= word1.length; i++) {
                        const cost = word1[i-1] === word2[j-1] ? 0 : 1;
                        matrix[j][i] = Math.min(
                            matrix[j-1][i] + 1,
                            matrix[j][i-1] + 1,
                            matrix[j-1][i-1] + cost
                        );
                    }
                }
                return matrix[word2.length][word1.length];
            }

            // Obtiene todas las palabras del Trie
            getAllWords(node = this.root, prefix = '', words = []) {
                if (node.isEndOfWord) {
                    words.push(prefix);
                }
                for (let char in node.children) {
                    this.getAllWords(node.children[char], prefix + char, words);
                }
                return words;
            }

            // Obtiene sugerencias para corrección ortográfica
            getSpellCheckSuggestions(word, maxDistance = 2) {
                const allWords = this.getAllWords();
                return allWords
                    .map(w => ({ word: w, distance: this.levenshteinDistance(word, w) }))
                    .filter(({ distance }) => distance <= maxDistance && distance > 0)
                    .sort((a, b) => a.distance - b.distance)
                    .map(({ word }) => word)
                    .slice(0, 3);
            }
        }

        const spellCheckTrie = new Trie();
        palabrasEjemplo.forEach(word => {
            spellCheckTrie.insert(word);
        });

        // Creamos el gráfico de distancias
        const createDistanceChart = (inputWord) => {
            const container = d3.select("#distanceChart");
            const width = container.node().getBoundingClientRect().width;
            const height = 400;
            const margin = { top: 20, right: 20, bottom: 60, left: 60 };
            const maxWords = 10;

            container.html("");

            const distances = palabrasEjemplo.map(word => ({
                word,
                distance: spellCheckTrie.levenshteinDistance(inputWord, word)
            })).sort((a, b) => a.distance - b.distance)
                .slice(0, maxWords);

            const svg = container
                .append("svg")
                .attr("width", "100%")
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserveAspectRatio", "xMidYMid meet");

            const x = d3.scaleBand()
                .range([margin.left, width - margin.right])
                .domain(distances.map(d => d.word))
                .padding(0.1);

            const y = d3.scaleLinear()
                .range([height - margin.bottom, margin.top])
                .domain([0, d3.max(distances, d => d.distance)]);

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(distances)
                .enter()
                .append("rect")
                .attr("x", d => x(d.word))
                .attr("y", d => y(d.distance))
                .attr("width", x.bandwidth())
                .attr("height", d => height - margin.bottom - y(d.distance))
                .attr("fill", "#4a90e2");
        };

        // Manejamos la interacción del usuario
        document.getElementById('spellCheckInput')?.addEventListener('input', (e) => {
            const word = e.target.value.toLowerCase();
            const suggestions = spellCheckTrie.getSpellCheckSuggestions(word, 2);
            const suggestionsDiv = document.getElementById('spellCheckSuggestions');
            if (word.length === 0) {
                suggestionsDiv.innerHTML = '';
            } else if (spellCheckTrie.search(word)) {
                suggestionsDiv.innerHTML = 'La palabra está en el diccionario';
            } else if (suggestions.length > 0) {
                suggestionsDiv.innerHTML = `¿Quisiste decir: ${suggestions.join(', ')}?`;
            } else {
                suggestionsDiv.innerHTML = 'No hay sugerencias disponibles';
            }
            createDistanceChart(word);
        });

        // Agregamos el contenedor para el gráfico
        const chartContainer = document.createElement('div');
        chartContainer.id = 'distanceChart';
        chartContainer.style.marginTop = '20px';
        document.querySelector('.spell-check-demo').appendChild(chartContainer);
    }, []);

    return (
        <div className="spell-check-demo">
            <input id="spellCheckInput" type="text" placeholder="Escribe una palabra..." />
            <div id="spellCheckSuggestions"></div>
        </div>
    );
};

export default AutocorrectComponent;