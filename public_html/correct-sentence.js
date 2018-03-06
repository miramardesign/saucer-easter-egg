"use strict";

function correctSentence(text) {
    // returns a corrected sentence which starts with capital letter
    // and ends with dot.

//    text = text[0].toUpperCase() + text.substring(1, text.length - 1);
//    console.log("texty?", text);
//    
//    var lastChar = text[text.length - 1];
//    console.log('lasty', lastChar);
//    if( lastChar !== '.'){
//        text = text + '.';
//    }
    
    return text;
}

var assert = require('assert');
if (!global.is_checking) {
    console.log('Example:');
//    console.log(correctSentence("greetings, friends"));
//
//    // These "asserts" using for self-checking and not for auto-testing
//    assert.equal(correctSentence("greetings, friends"), "Greetings, friends.");
//    assert.equal(correctSentence("Greetings, friends"), "Greetings, friends.");
//    assert.equal(correctSentence("Greetings, friends."), "Greetings, friends.");
    assert.equal(correctSentence("hi"), "Hi.");
    console.log("Coding complete? Click 'Check' to earn cool rewards!");
}/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


