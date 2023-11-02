const createField = document.getElementById("create-field")

const getTemplate = (items) => {
    return `
         <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${items.text}</span>
            <div>
              <button data-id = "${items._id}" id ="edit" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button data-id = "${items._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
}

let ourHtml = (items).map((item)=>{
    return getTemplate(item)
}).join("")
document.getElementById("items-list").insertAdjacentHTML("beforeend", ourHtml)

console.log(ourHtml)

document.getElementById("item-field").addEventListener("submit", (e) => {
    e.preventDefault()
    axios.post("/create-item", {text: createField.value})
    .then(function(res) {
        document.getElementById("items-list").insertAdjacentHTML("beforeend", getTemplate(res.data))  
        createField.value = ""
        createField.focus()
         }      
        ).catch(()=>
            {
                console.log("There is a problem with sending this req")
            }
        )
})


document.addEventListener("click", (e)=>{

    if(e.target.classList.contains("delete-me")) {
        if(confirm("Are you sure you want to delete this item?")) {
            axios.post("/delete-item", {id:e.target.getAttribute("data-id")})
            .then(
                e.target.parentElement.parentElement.remove()
            ).catch(
                console.log("we are having problem with this")
            )
        }
    }

    if(e.target.classList.contains("edit-me")) {
        console.log(e.target.getAttribute("data-id"))
        let update = prompt("Enter the updated items", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML).trim()
        if(!update) {
            return null
        } else {
            axios.post("/update-item", {text: update, id:e.target.getAttribute("data-id")})
        .then(function(res) {
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = res.data.text
        }
        ).catch((err)=>
            {
                console.error(err)
                console.log("There is a problem with sending this req")
            }
        )
        }
    }
})
