// discord.js node module
const discord = require("discord.js")
// node-cron module for scheduling
const cron = require("node-cron")
// EmbedBuilder creates new Posts on its own
// SlashCommandBuilder creates a new slash command
// GuildScheduled... is for scheduled events
const { EmbedBuilder,
    SlashCommandBuilder,
    GuildScheduledEventManager,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType } = require("discord.js")

// here are the privacy things
const { token } =  require("./config.json")

// discord intents - content we want to have in the bot
// discord partials - data returned from an object 
const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.DirectMessages,
        discord.GatewayIntentBits.MessageContent,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildScheduledEvents

    ], 
    partials: [
        discord.Partials.Channel,
        discord.Partials.GuildMember,
        discord.Partials.Message,
        discord.Partials.User
    ]
});

//Ready event captures the state when the bot gets online
client.on("ready", (client) => {
    console.log("This bot is now online " + client.user.tag)
});

// Messages - The discord bot responds to these
// Complete Message documentation is to be found here:
// old.discordjs.dev/#/docs/discord.js/main/class/Message

client.on("messageCreate", async (message) => {
    // Checks if the message is written by an bot
    if(message.author.bot==true){
        return;
    }

    // Convert the user's msg to lowercase
    const msgLC = message.content.toLowerCase();
    //Commands using the bot
    if (msgLC == "!help"){
        message.reply("This bot has the following commands: \n !help \n !poll Question;Answer1;Answer2;...;Answer10 --- this is case sensitive! \n For anything else please reach out to a server admin");
    }
    
    // This creates a very simple poll in discord
    else if (message.content.startsWith("!poll")) {
        // arguments are split with ;
        const args = message.content.slice("!poll").trim().split(';');
        const question = args[0];
        const options = args.slice(1);
        // creating just the poll without the command
        const argsNew = question.split(" ");
        const pollText = argsNew.slice(1);
        var poll = []
        for (let i=0;i<pollText.length;i++){
            poll += pollText[i]+" ";
        }
        // error msg just calling !poll without any argument
        if (!question || options.length < 2) {
            return message.channel.send('Please type in a question and at least two answers, all have to be seperated by semicolons');
        }
        // the maximumt amount of answers is 10
        let questionText = `**${poll}**\n`;
        const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯'];

        options.forEach((option, index) => {
            questionText += `${emojis[index]} ${option}\n`;
        });

        const questionMessage = await message.channel.send(questionText);

        options.forEach((_,index) => {
            questionMessage.react(emojis[index]);
        });
    }
});

// Events - The discord bot responds to these
// Event: When a new member joins the server
client.on('guildMemberAdd', async (member) => {
    // Searches all member.guild.channels for something
    member.guild.channels.cache.forEach(channel => {
        // searches for the string "welcome", change this to a unique part of the name of your welcome channel
        if (channel.name.includes('welcome')) {

            // This line is for testing purposes only
            //console.log(`Found channel: ${channel.name} in guild: ${member.guild.name}`);

            // welcomeChannel needs to be a channel and not channel.name
            var welcomeChannel = channel;

            // Get the total number of members in the server
            const memberCount = member.guild.memberCount;
            
            // Create an embed message
            const embed = new discord.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Welcome to the '+member.guild.name + " discord server "+member.user.username)
            .setDescription("Please take a look around and adhere to the local discord ruleset. : )")
            .setTimestamp();
 
            // Send the embed message to the welcome channel
            welcomeChannel.send({embeds: [embed]});
        }
    });      
});

// Timed-Task: A scheduled poll, every day at the same time to ask people where to get lunch today
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // This creates a very simple poll in discord at 9 am everyday
    cron.schedule('0 9 * * 1-5', () => {
        // Replache "channel-ID" with your desired channel-ID
        const channelId = 'channel-ID'; //lunch-channel-ID
        const question = 'Question?';
        const options = ['Option1', 'Option2', 'Option3'];

        let pollText = `**${question}**\n`;
        const emojis = ['🇦', '🇧', '🇨'];

        options.forEach((option, index) => {
            pollText += `${emojis[index]} ${option}\n`;
        });

        const channel = client.channels.cache.get(channelId);
        if (channel) {
            channel.send(pollText).then(pollMessage => {
                options.forEach((_, index) => {
                    pollMessage.react(emojis[index]);
                });
            }).catch(console.error);
        } else {
            console.error('Channel not found');
        }
    });
});


//Logs the client in and establishes a working connection
client.login(token);

