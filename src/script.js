document.addEventListener("DOMContentLoaded", function(){
    const body = document.body;

    const noteInput = document.querySelector("#note-input");
    const saveNoteButton = document.querySelector("#save-note");
    const noteList = document.querySelector("#note-list");

    const confirmModal = document.querySelector("#confirm-modal");
    const cancelDeleteBtn = document.querySelector("#cancel-delete");
    const confirmDeleteBtn = document.querySelector("#confirm-delete");
    let noteToDelete = null;

    loadNotes();

    const searchInput = document.querySelector("#search-input");

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();

        document.querySelectorAll("#note-list li").forEach((li) => {
        const noteText = li.querySelector("span").textContent.toLowerCase();
        const tags = li.getAttribute("data-tags")?.toLowerCase() || "";

        const matchesText = noteText.includes(searchTerm);
        const matchesTag = tags.includes(searchTerm.startsWith("#") ? searchTerm.slice(1) : searchTerm);

        li.style.display = (searchTerm.startsWith("#") ? matchesTag : matchesText) ? "flex" : "none";
        });
    });


    cancelDeleteBtn.addEventListener("click", function () {
        noteToDelete = null;
        confirmModal.classList.add("hidden"); // Modalı gizle
    });
    
    confirmDeleteBtn.addEventListener("click", function () {
        if (noteToDelete) {
            noteToDelete.remove();
            saveNotes();
            noteToDelete = null;
            confirmModal.classList.add("hidden");
        }
    });

    // Notu kaydet butonuna tıklanınca çalışır.
    saveNoteButton.addEventListener("click", function(){
        console.log("Kaydet butonuna tıklandı");
        addNote(noteInput.value);
        noteInput.value = "";
    });

    // Enter tuşu ile not ekleme
    noteInput.addEventListener("keypress", function(e){
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            addNote(noteInput.value);
            noteInput.value = "";
        }
    });

    function addNote(noteText, noteDate = null, shouldSave = true){

        if(noteText.trim() === "") return;

        console.log("Yeni not ekleniyor:", noteText);

        const createdAt = noteDate || new Date().toLocaleString("tr-TR");
        const tags = noteText.match(/#\w+/g) || [];
        const li = document.createElement("li");
        li.setAttribute("data-tags", tags.join(","));

        li.className = "flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md shadow-sm";
        li.innerHTML = `
            <div class="flex flex-col w-full">
                <span class="text-gray-800" data-date="${createdAt}">${noteText}</span>
                <small class="text-xs text-gray-500 mt-1">📅 ${createdAt}</small>
            </div>
            <div class="flex gap-2">
                <button class="edit-btn text-yellow-500 hover:text-yellow-600 transition">✏️</button>
                <button class="delete-btn text-red-500 hover:text-red-700 transition">❌</button>
            </div>
        `;

        noteList.appendChild(li);

        if(shouldSave){
            saveNotes();
        }

        li.querySelector(".delete-btn").addEventListener("click", function(){
            noteToDelete = li;
            confirmModal.classList.remove("hidden"); 
        });

        li.querySelector(".edit-btn").addEventListener("click", function () {
            li.setAttribute("data-tags",tags.join(","));
            
            const span = li.querySelector("div span");
            const originalText = span.textContent;
        
            const textarea = document.createElement("textarea");
            textarea.className = "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500";
            textarea.value = originalText;
        
            li.querySelector("div").replaceChild(textarea, span);
            textarea.focus();
        
            textarea.addEventListener("blur", function () {
                const updatedText = textarea.value.trim();
                const date = new Date().toLocaleString("tr-TR");
        
                const newSpan = document.createElement("span");
                newSpan.textContent = updatedText || originalText;
                newSpan.className = "text-gray-800";
                newSpan.setAttribute("data-date", date);
              
                li.querySelector("div").replaceChild(newSpan, textarea);

                const small = li.querySelector("small");
                small.textContent = `📅 ${date}`;
                
                saveNotes();
            });
        });
    }

    function saveNotes(){
        const notes = [];
        document.querySelectorAll("#note-list li span").forEach(noteElement => {
            notes.push({
                text: noteElement.textContent,
                date: noteElement.getAttribute("data-date")
            });
        });
        console.log("Kaydedilen Notlar:",notes);
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function loadNotes(){
        const storedNotes = localStorage.getItem("notes");

        if(!storedNotes){
            console.log("Local Storage boş, yüklenmedi.");
            return;
        }

        const notes = JSON.parse(storedNotes);
        console.log("Yüklenen Notlar:", notes);

        notes.forEach(note => {
            addNote(note.text, note.date , false);
        });
    }
});