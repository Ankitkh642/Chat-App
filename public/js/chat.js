const socket=io()

//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')
const $sendLocationButton=document.querySelector('#location')
const $messages=document.querySelector('#messages')

//templates
const message_template=document.querySelector('#message_template').innerHTML
const location_template=document.querySelector('#location_template').innerHTML

socket.on('message',(message)=>{
    console.log(message.text)
    const html=Mustache.render(message_template,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend",html)
})
socket.on('locationmessage',(location)=>{
    console.log(location.url)
    const html=Mustache.render(location_template,{
        url:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
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
            return console.log(error)
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