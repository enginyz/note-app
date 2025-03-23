document.addEventListener("DOMContentLoaded", function(){
    const noteInput = document.querySelector("#note-input");
    const saveNoteButton = document.querySelector("#save-note");
    const noteList = document.querySelector("#note-list");

    const confirmModal = document.querySelector("#confirm-modal");
    const cancelDeleteBtn = document.querySelector("#cancel-delete");
    const confirmDeleteBtn = document.querySelector("#confirm-delete");
    let noteToDelete = null;

    loadNotes();

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

    function addNote(noteText, shouldSave = true){
        if(noteText.trim() === "") return;

        console.log("Yeni not ekleniyor:", noteText);

        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-200 p-2 rounded-md shadow-sm";
        li.innerHTML = `
            <span class="text-gray-800">${noteText}</span>
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
            const span = li.querySelector("span");
            const originalText = span.textContent;
        
            // Geçici textarea oluştur
            const textarea = document.createElement("textarea");
            textarea.className = "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500";
            textarea.value = originalText;
        
            // Span yerine textarea’yı koy
            li.replaceChild(textarea, span);
            textarea.focus();
        
            // Enter'a basıldığında veya odak kaybolduğunda güncelle
            textarea.addEventListener("blur", function () {
                const updatedText = textarea.value.trim();
                if (updatedText !== "") {
                    const newSpan = document.createElement("span");
                    newSpan.textContent = updatedText;
                    newSpan.className = "text-gray-800";
        
                    li.replaceChild(newSpan, textarea);
                    saveNotes(); 
                } else {
                    const originalSpan = document.createElement("span");
                    originalSpan.textContent = originalText;
                    originalSpan.className = "text-gray-800";
        
                    li.replaceChild(originalSpan, textarea);
                }
            });
        });
    }

    function saveNotes(){
        const notes = [];
        document.querySelectorAll("#note-list li span").forEach(noteElement => {
            notes.push(noteElement.textContent);
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
            addNote(note, false);
        });
    }
});