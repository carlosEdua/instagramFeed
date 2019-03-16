let photosLinks = []
let info;
let userNameInstagram = 'rxph_photography';
	async function instagramPhotos (username) {
    // It will contain our photos' links
    photosLinks = [];
    try {
        const userInfoSource = await axios.get(`https://www.instagram.com/${username}/`)

        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

        const userInfo = JSON.parse(jsonObject)
        info = userInfo;
		console.log('1',userInfo);
		
        // Retrieve only the first 10 results
        const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 10)
		console.log('2',mediaArray);
		
		for (let media of mediaArray) {
            const node = media.node
            
            // Process only if is an image
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }
            let thumbnail = node.thumbnail_src,
                completeImage = node.display_url,
                linkPost = node.shortcode;
            // Push the photos links
            photosLinks.push([thumbnail,completeImage,linkPost]);
            show();
        }
    } catch (e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
    }
    
}
instagramPhotos(userNameInstagram);

function show(){
    const container = document.querySelector('.gallery-container');
    container.innerHTML = '';

    for(let link of photosLinks){
        container.innerHTML += `
        <div class="pic-container">
            <a href="${link[1]}" data-lightbox="gallery" data-title='<a href="https://instagram.com/p/${link[2]}" target="_blank">view in instagram</a>'>
                <img src=${link[0]}>
            </a>
        </div>
        `
    }
}

// event listener for the input
document.getElementById('inputUsername').addEventListener('keyup', function(event){
    if(event.key == "Enter") instagramPhotos(this.value);
});

// search the user
function search(){
    let username = document.getElementById('inputUsername').value;
    instagramPhotos(username);
}


