const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// حط آيدي حسابك هنا عشان تكون أنت الوحيد اللي يقدر يرسل الأمر
const OWNER_ID = '1381660062790979587'; 

// آيديkات رتب الألوان الـ 20
const colorRoles = {
    'color_1': '1538315146064166912',
    'color_2': '1538315167253925919',
    'color_3': '1538315205778612244',
    'color_4': '1538314986823098388',
    'color_5': '1538315007266132109',
    'color_6': '1538315031546957974',
    'color_7': '1538315052032065646',
    'color_8': '1538315080951660564',
    'color_9': '1538315102447476736',
    'color_10': '1538315126749528175',
    'color_11': '1538314930510499870',
    'color_12': '1538314948642471997',
    'color_13': '1538314967923564565',
    'color_14': '1538315231636365413',
    'color_15': '1538315248971423874',
    'color_16': '1538315274904932402',
    'color_17': '1538315298069946368',
    'color_18': '1538315326930952192',
    'color_19': '1538315350511329421',
    'color_20': '1538315372338610296'
};

client.once('ready', () => {
    console.log(`✅ البوت اشتغل زي الحلاوة باسم: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    if (message.content === '!colors') {
        if (message.author.id !== OWNER_ID) return;

        // هنا طريقتنا لتنسيق الألوان تحت بعضها بداخل الـ Embed تماماً مثل برو بوت
        const descriptionText = [
            `✦ <@&1538315146064166912>  |  1`,
            `✦ <@&1538315167253925919>  |  2`,
            `✦ <@&1538315205778612244>  |  3`,
            `✦ <@&1538314986823098388>  |  4`,
            `✦ <@&1538315007266132109>  |  5`,
            `✦ <@&1538315031546957974>  |  6`,
            `✦ <@&1538315052032065646>  |  7`,
            `✦ <@&1538315080951660564>  |  8`,
            `✦ <@&1538315102447476736>  |  9`,
            `✦ <@&1538315126749528175>  |  10`,
            `✦ <@&1538314930510499870>  |  11`,
            `✦ <@&1538314948642471997>  |  12`,
            `✦ <@&1538314967923564565>  |  13`,
            `✦ <@&1538315231636365413>  |  14`,
            `✦ <@&1538315248971423874>  |  15`,
            `✦ <@&1538315274904932402>  |  16`,
            `✦ <@&1538315298069946368>  |  17`,
            `✦ <@&1538315326930952192>  |  18`,
            `✦ <@&1538315350511329421>  |  19`,
            `✦ <@&1538315372338610296>  |  20`
        ].join('\n');

        const embed = new EmbedBuilder()
            .setTitle('colors')
            .setDescription(descriptionText)
            .setColor('#2b2d31');

        // قائمة منسدلة بسيطة ومرتبة بالأسفل للاختيار
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('color_select_menu')
                .setPlaceholder('اختر لونك')
                .addOptions([
                    { label: '1', value: 'color_1' },
                    { label: '2', value: 'color_2' },
                    { label: '3', value: 'color_3' },
                    { label: '4', value: 'color_4' },
                    { label: '5', value: 'color_5' },
                    { label: '6', value: 'color_6' },
                    { label: '7', value: 'color_7' },
                    { label: '8', value: 'color_8' },
                    { label: '9', value: 'color_9' },
                    { label: '10', value: 'color_10' },
                    { label: '11', value: 'color_11' },
                    { label: '12', value: 'color_12' },
                    { label: '13', value: 'color_13' },
                    { label: '14', value: 'color_14' },
                    { label: '15', value: 'color_15' },
                    { label: '16', value: 'color_16' },
                    { label: '17', value: 'color_17' },
                    { label:  '18', value: 'color_18' },
                    { label: '19', value: 'color_19' },
                    { label: '20', value: 'color_20' }
                ]),
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        await message.delete();
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'color_select_menu') {
        await interaction.deferReply({ ephemeral: true });

        const selectedValue = interaction.values[0];
        const roleId = colorRoles[selectedValue];
        const member = interaction.member;

        if (!roleId) {
            return interaction.editReply({ content: 'عفواً، صار فيه خطأ واللون هذا مهوب متوفر حالياً.' });
        }

        try {
            const allColorRoleIds = Object.values(colorRoles);
            
            const rolesToRemove = member.roles.cache.filter(role => allColorRoleIds.includes(role.id));
            if (rolesToRemove.size > 0) {
                await member.roles.remove(rolesToRemove);
            }

            await member.roles.add(roleId);

            await interaction.editReply({ content: '✨ أبشر، تم ضبط لونك بنجاح!' });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ ما قدرت أعطيك الرتبة، تأكد إن رتبة البوت صايرة فوق رتب الألوان بإعدادات السيرفر.' });
        }
    }
});

client.login(process.env.TOKEN);