let cardArea = document.querySelector('.cards-area')
let BASE_URL = `https://user-list.alphacamp.io`
let INDEX_URL = BASE_URL + `/api/v1/users/`
let userID = 1
let SHOW_URL = `${BASE_URL}/api/v1/users/${userID}`
let allUsersArr = []
let renderFavorite = []
let favoriteList = []
const userPerPage = 8
let paginator = document.querySelector('.pagination')
paginator.innerHTML = ""
let modal = document.querySelector('.modal')
// 稍後做搜尋用的
let filteredUsers = []
let searchBar = document.querySelector('.searchBar')


// console.log(INDEX_URL)

// get users api & render users
axios.get(INDEX_URL).then((response) => {
  cardArea.innerHTML = ''

  // load all users
  allUsersArr = response.data.results
  // 第200個api有點問題 先砍掉
  allUsersArr.splice(199, 1)

  // render pageUsers
  let perPageUsersArr = renderUsersByPage(1)
  renderCard(perPageUsersArr)
  // render pagination
  let pageTotalNumber = Math.ceil(allUsersArr.length / userPerPage)
  renderPagination(pageTotalNumber)
})

// page action
paginator.addEventListener('click', function (event) {
  // console.log(event.target.dataset.page)
  renderCard(renderUsersByPage(event.target.dataset.page))
})

// card click 
cardArea.addEventListener('click', function onCardAreaClick(event) {
  // event.target.matches 可以用來檢查tagName 或是id&class; tag則不用加.#
  let id = Number(event.target.dataset.id)
  if (event.target.matches('.show-detail')) {
    // console.log(allUsersArr[id])
    renderUserMoadl(id)
  } else if (event.target.classList.contains('add-favorite')) {
    // it also works with classList.contains
    // just use 2 ways to try
    // console.log(event.target.dataset.id)
    favoriteList = JSON.parse(localStorage.getItem('favoriteList')) || []
    // 檢查user是否已存在list中
    if (favoriteList.some(user => user.id === id)) {
      return alert('already exist in favorite list')
    }
    let favoriteUser = allUsersArr.find(user => user.id === id)
    favoriteList.push(favoriteUser)
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList))
  }
  // test area
  // console.log(event.target)
})

// search func (filter)
searchBar.addEventListener('submit', function onSearchAction(event) {
  // 按下submit時 網頁會自動刷新!!!! 所以要加入下行
  event.preventDefault()

  let keyword = document.querySelector('#keyword').value

  filteredUsers = allUsersArr.filter(user => user.name.toLowerCase().includes(keyword.toLowerCase()))
  // console.log(filteredUsers)
  renderCard(renderUsersByPage(1))
  renderPagination(Math.ceil(filteredUsers.length / userPerPage))
})

// ----------------funtion Area --------------

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
            <a href="#" class="btn btn-danger add-favorite" data-id=${user.id}>Add</a>
          </div>
        </div>`
  })
}

function renderUsersByPage(pageNumber) {
  let startIndex = (pageNumber - 1) * 8
  let data = filteredUsers.length ? filteredUsers : allUsersArr
  let perPageUsersArr = data.slice(startIndex, startIndex + 8)

  return perPageUsersArr
}


function renderPagination(pageTotalNumber) {
  paginator.innerHTML = ''
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




// ================test Area==============
