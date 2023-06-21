let cardArea = document.querySelector('.cards-area')
let BASE_URL = `https://user-list.alphacamp.io`
let INDEX_URL = BASE_URL + `/api/v1/users/`
let userID = 1
let SHOW_URL = `${BASE_URL}/api/v1/users/${userID}`
let allUsersArr = []
const userPerPage = 8
let paginator = document.querySelector('.pagination')
paginator.innerHTML = ""
let modal = document.querySelector('.modal')


// renderFavorite user by localstorage
let favoriteList = JSON.parse(localStorage.getItem('favoriteList'))
// console.log(favoriteList)
renderCard(renderUsersByPage(1))
let pageTotalNumber = Math.ceil(favoriteList.length / userPerPage)
renderPagination(pageTotalNumber)


// card click 
cardArea.addEventListener('click', function onCardAreaClick(event) {
  // event.target.matches 可以用來檢查tagName 或是id&class; tag則不用加.#
  let id = Number(event.target.dataset.id)
  if (event.target.matches('.show-detail')) {
    // console.log(allUsersArr[id])
    renderUserMoadl(id)
  } else if (event.target.classList.contains('cancel-favorite')) {

    cancelFavorite(id)
  }
})



// page action
paginator.addEventListener('click', function (event) {
  let page = Number(event.target.dataset.page)
  console.log(page)
  renderCard(renderUsersByPage(page))
  renderPagination(favoriteList)
})

// ===================== funtion Area ===========================

function renderCard(users) {
  cardArea.innerHTML = ``
  users.forEach(user => {
    // console.log(user)
    cardArea.innerHTML += `        
  <div class="card col-sm-3" style="width:18rem;">
          <img
            src="${user.avatar}"
            class="card-img-top col-sm-3" alt="...">
          <div class="card-body">
            <h5 class="card-user-name">${user.name}</h5>
            <p class="card-user-email">${user.email}</p>
            <a href="#" class="btn btn-primary show-detail" data-id=${user.id} 
            data-bs-toggle="modal" 
            data-bs-target="#userModal">More</a>
            <a href="#" class="btn btn-danger cancel-favorite" data-id=${user.id} 
            >X</a>
          </div>
        </div>`
  })
}

function renderUsersByPage(pageNumber) {
  let startIndex = (pageNumber - 1) * 8
  // 檢查favo長度 若為零 存入alluser 這樣index和favorite.js都能用這函式
  let data = favoriteList.length ? favoriteList : allUsersArr
  let perPageUsersArr = data.slice(startIndex, startIndex + 8)
  console.log('data' + data)
  console.log(favoriteList)
  return perPageUsersArr
}

function renderPagination(pageTotalNumber) {

  for (let i = 1; i <= pageTotalNumber; i++) {
    paginator.innerHTML += `
            <li class="page-item" ><a class="page-link" data-page=${i} href="#">${i}</a></li>
  `

  }
}

function renderUserMoadl(id) {
  let userName = document.querySelector('.user-name')
  let userImg = document.querySelector('.user-img')
  let userBirthday = document.querySelector('.user-birthday')
  let userCreatedAt = document.querySelector('.user-creatTime')
  let userRegion = document.querySelector('.user-region')

  axios.get(INDEX_URL + id).then((response) => {
    let data = response.data
    // console.log(data)
    userName.textContent = data.name
    userImg.src = data.avatar
    userBirthday.textContent = `Birthday: ${data.birthday}`
    userCreatedAt.innerHTML = 'Created_at: </br> ' + data.created_at.substring(0, 10)
    userRegion.textContent = 'Region: ' + data.region
  })
}


function cancelFavorite(id) {
  let cancelIndex = favoriteList.findIndex(user => user.id === id)
  if (cancelFavorite === -1) {
    return
  }
  favoriteList.splice(cancelIndex, 1)
  localStorage.setItem('favoriteList', JSON.stringify(favoriteList))
  renderPagination(favoriteList)

  let curPageNumb = Math.ceil(cancelIndex / userPerPage)
  console.log(`curUserIndex=${cancelIndex}`)
  console.log(`curPageNumb=${curPageNumb}`)
  renderCard(renderUsersByPage(curPageNumb))
}


// ================test Area==============
