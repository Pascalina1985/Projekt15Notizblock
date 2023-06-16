document.getElementById("noteForm").addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    let noteTitle = document.getElementById("noteTitle").value;
    let noteContent = document.getElementById("noteContent").value;
    let currentDate = new Date().toLocaleString();
    let noteCategory = document.getElementById("noteCategory").value;

    let newNote = {
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        dateTime: currentDate,
        completed: false
    };

    let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
    existingNotes.unshift(newNote);


    existingNotes.sort(function(a, b) {
        return new Date(b.dateTime) - new Date(a.dateTime);
    });

    localStorage.setItem("notes", JSON.stringify(existingNotes));

    updateNoteList();

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
}

function updateNoteList() {
    let noteListElement = document.getElementById("noteList");
    noteListElement.innerHTML = "";

    let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];

    existingNotes.forEach(function(note, index) {
        let checkboxId = `checkbox-${index}`;
        let noteHTML = `
      <li>
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <p><strong>Kategorie: </strong>${note.category}</p>
        <p><small>Erstellt am: ${note.dateTime}</small></p>
        <div class='buttonContainer'>
        <button onclick="deleteNote(${index})">Löschen</button>
        <button onclick="bearbeitenNote(${index})">Bearbeiten</button>       
        <label for="checkbox-${index}">
        erledigt
        <input type="checkbox" id="checkbox-${index}" ${note.completed ? 'checked' : ''} onchange="toggleCompleted(${index})">
        </label>
        </div>    
      </li>`;

        noteListElement.innerHTML += noteHTML;

    });
}

function deleteNote(index) {
    let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
    existingNotes.splice(index, 1);

    localStorage.setItem("notes", JSON.stringify(existingNotes));

    updateNoteList();
}

function bearbeitenNote(index) {
    let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
    let note = existingNotes[index];

    let newTitle = prompt("Neuer Titel:", note.title);
    let newText = prompt("Neuer Text:", note.Content);

    note.title = newTitle;
    note.content = newText;
    note.completed = document.getElementById(`checkbox-${index}`).checked;


    existingNotes[index] = note;

    localStorage.setItem("notes", JSON.stringify(existingNotes));

    updateNoteList();
}

function toggleCompleted(index) {
    let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
    existingNotes[index].completed = !existingNotes[index].completed;

    localStorage.setItem("notes", JSON.stringify(existingNotes));

    updateNoteList();
}

function searchNotes() {
    let keyword = document.getElementById('searchKeyword').value.toLowerCase();

    if (keyword.trim() === "") { // Beende die Funktion, wenn kein Stichwort eingegeben wurde
        return;
    }

    let existingNotes = JSON.parse(localStorage.getItem('notes')) || [];

    let filteredNotes = existingNotes.filter(function(note) {
        let title = note.title.toLowerCase();
        let content = note.content.toLowerCase();

        return title.includes(keyword) || content.includes(keyword); // Überprüfen, ob das Stichwort im Titel oder Inhalt der Notiz enthalten ist
    });

    updateNoteList(filteredNotes); // Aktualisiere die Notizliste mit den gefilterten Notizen

    document.getElementById('searchKeyword').value = '';

    document.getElementById('searchKeyword').focus(); // Fokus auf das Textfeld setzen

    highlightMatchingNotes(keyword); // Ändere die Hintergrundfarbe des Notizeintrags basierend auf dem Treffer
}

function highlightMatchingNotes(keyword) {
    let noteListElement = document.getElementById("noteList");
    let notes = noteListElement.getElementsByTagName("li");

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];
        let title = note.getElementsByTagName("h3")[0].innerText.toLowerCase();
        let content = note.getElementsByTagName("p")[0].innerText.toLowerCase();

        if (title.includes(keyword) || content.includes(keyword)) { // Überprüfe, ob das Stichwort im Titel oder Inhalt der Notiz vorhanden ist
            note.classList.add("highlight");
        } else {
            note.classList.remove("highlight");
        }
    }
}

let searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchNotes);

updateNoteList();