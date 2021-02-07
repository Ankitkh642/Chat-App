const socket=io()

//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')
const $sendLocationButton=document.querySelector('#location')
const $messages=document.querySelector('#messages')
const $chat_sidebar=document.querySelector('#sidebar')

//templates
const message_template=document.querySelector('#message_template').innerHTML
const location_template=document.querySelector('#location_template').innerHTML
const sideBar_template=document.querySelector('#sidebar-template').innerHTML

//query string
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    // new message element
    const $newMessage=$messages.lastElementChild

    //height of new message
    const newMessageStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

    //visible height
    const visibleHeight=$messages.offsetHeight
    
    //container height
    const containerHeight=$messages.scrollHeight

    //how far we have scrolled
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message.text)
    const html=Mustache.render(message_template,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})
socket.on('locationmessage',(location)=>{
    console.log(location.url)
    const html=Mustache.render(location_template,{
        username:location.username,
        url:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sideBar_template,{
        room,
        users
    })
    $chat_sidebar.innerHTML=html
})

$messageForm.addEventListener(('submit'),(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const msg=e.target.elements.message.value
    socket.emit('sendmessage',msg,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
        {
            return alert('Bad Words Not allowed')
        }
        console.log('The message was delieverd')
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    return alert('No feature for geoLocation')

    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        const lat=position.coords.latitude
        const long=position.coords.longitude
        socket.emit('sendLocation',{
            lat:position.coords.latitude,
            long:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Delievered')
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }

})