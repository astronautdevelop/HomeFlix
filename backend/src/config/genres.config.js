"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CATEGORIES = exports.ALL_GENRES = exports.SPECIAL_GENRES = exports.GENRE_DISPLAY_NAMES = exports.TMDB_GENRES = void 0;
// Lista completa dei generi TMDB (ID → Nome)
exports.TMDB_GENRES = {
    28: 'Azione',
    12: 'Avventura',
    16: 'Animazione',
    35: 'Commedia',
    80: 'Crime',
    99: 'Documentario',
    18: 'Dramma',
    10751: 'Famiglia',
    14: 'Fantasy',
    36: 'Storia',
    27: 'Horror',
    10402: 'Musica', // ⚠️ Verrà mappato in "Concerti Live"
    9648: 'Mistero',
    10749: 'Romance',
    878: 'Fantascienza',
    10770: 'Televisione Film',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Western',
};
// Mappatura per la visualizzazione (es. Musica → Concerti Live)
exports.GENRE_DISPLAY_NAMES = {
    'Musica': 'Concerti Live',
    // Aggiungi altre mappature se necessario
};
// Categorie speciali (non TMDB)
exports.SPECIAL_GENRES = ['Serie TV', 'Altro'];
// Lista di tutti i generi TMDB in ordine alfabetico per la visualizzazione
exports.ALL_GENRES = Object.values(exports.TMDB_GENRES)
    .map(function (g) { return exports.GENRE_DISPLAY_NAMES[g] || g; })
    .sort();
// Lista completa con tutte le categorie (TMDB + Speciali)
exports.ALL_CATEGORIES = __spreadArray(__spreadArray([], exports.ALL_GENRES, true), exports.SPECIAL_GENRES, true);
