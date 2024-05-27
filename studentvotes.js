const apiUrl = 'https://crudcrud.com/api/b85583d82ace4a0a99247049cbe9c4ab/votes';
const voteForm = document.getElementById('voteForm');
const totalVotesSpan = document.getElementById('totalVotes');
const candidateList = document.getElementById('candidateList');

// Keep track of usernames that have already voted
let votedUsernames = [];

document.addEventListener('DOMContentLoaded', fetchVotes);

voteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const candidate = document.getElementById('candidate').value;
    
    if (username && candidate && !votedUsernames.includes(username)) {
        const vote = { username, candidate };
        postVote(vote);
        // Clear the input fields
        document.getElementById('username').value = '';
        document.getElementById('candidate').value = 'Abhay';
    }
});

function fetchVotes() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const votes = JSON.parse(xhr.responseText);
            // Update total votes
            totalVotesSpan.textContent = votes.length;
            renderVotes(votes);
            // Populate the list of voted usernames
            votedUsernames = votes.map(vote => vote.username);
        }
    };
    xhr.send();
}

function postVote(vote) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 201) {
            fetchVotes();
        }
    };
    xhr.send(JSON.stringify(vote));
}

function deleteVote(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${apiUrl}/${id}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            fetchVotes();
        }
    };
    xhr.send();
}

function renderVotes(votes) {
    candidateList.innerHTML = '';
    const voteCounts = {};

    const candidates = ['Abhay', 'Ananya', 'Nikky'];
    candidates.forEach(candidate => {
        voteCounts[candidate] = 0;
    });

    votes.forEach(vote => {
        if (candidates.includes(vote.candidate)) {
            voteCounts[vote.candidate]++;
        }
    });

    const totalVotes = Object.values(voteCounts).reduce((total, count) => total + count, 0);
    totalVotesSpan.textContent = totalVotes;

    candidates.forEach(candidate => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${candidate}</strong>: ${voteCounts[candidate]} votes`;
        
        const ul = document.createElement('ul');
        votes.filter(v => v.candidate === candidate).forEach(v => {
            const voteLi = document.createElement('li');
            voteLi.textContent = `${v.username} `;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteVote(v._id));
            
            voteLi.appendChild(deleteButton);
            ul.appendChild(voteLi);
        });

        li.appendChild(ul);
        candidateList.appendChild(li);
    });
}
