"use client";

import React, { useState, useEffect } from 'react';

function SuggestionDemo() {
  // Clase para el nodo del Trie
  class TrieNode {
    constructor() {
      this.children = new Map();
      this.isEndOfWord = false;
    }
  }

  // Clase principal del Trie
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }

    insert(word) {
      let current = this.root;
      for (const char of word) {
        if (!current.children.has(char)) {
          current.children.set(char, new TrieNode());
        }
        current = current.children.get(char);
      }
      current.isEndOfWord = true;
    }

    getSuggestions(prefix) {
      let current = this.root;
      for (const char of prefix) {
        if (!current.children.has(char)) {
          return [];
        }
        current = current.children.get(char);
      }

      const suggestions = [];
      const findWords = (node, word) => {
        if (suggestions.length >= 3) return;
        
        if (node.isEndOfWord) {
          suggestions.push(word);
        }

        for (const [char, childNode] of node.children) {
          findWords(childNode, word + char);
        }
      };

      findWords(current, prefix);
      return suggestions;
    }
  }

  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const autocompleteTrie = new Trie();
    const animales = window.words || [
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
  ]; // Ensure window.words is defined

    animales.forEach(animal => {
      autocompleteTrie.insert(animal);
    });

    const handleInput = (e) => {
      const prefix = e.target.value.toLowerCase();
      setInputValue(prefix);
      const newSuggestions = autocompleteTrie.getSuggestions(prefix);
      setSuggestions(newSuggestions);
    };

    const inputElement = document.getElementById('autocompleteInput');
    inputElement?.addEventListener('input', handleInput);

    return () => {
      inputElement?.removeEventListener('input', handleInput);
    };
  }, []);

  return (
    <div>
      <input 
        type="text" 
        id="autocompleteInput"
        placeholder="Escribe el nombre de un animal..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="p-2 text-lg border border-gray-300 rounded-md w-full"
      />
      <div className="p-2">
        {inputValue.length === 0 ? '' : suggestions.length > 0 ? `Sugerencias: ${suggestions.join(', ')}` : 'No hay sugerencias disponibles'}
      </div>
    </div>
  );
}

export default SuggestionDemo;
