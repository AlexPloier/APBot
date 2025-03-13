/* Find all the welcome channels on all servers
    client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(channel => {
            if (channel.name.includes('welcome')) {
                console.log(`Found channel: ${channel.name} in guild: ${guild.name}`);
            }
        });
    });
    */
   
// logs all the messages by username
//console.log(message.author.username)