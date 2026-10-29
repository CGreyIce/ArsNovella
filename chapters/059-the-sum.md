---
number: 59
title: The Sum
volume: 2
date: 2026-10-29
---

Chris had a theory about bugs.

The worst ones, he'd always said, weren't the ones that crashed everything. Those were easy. Something broke, you looked at what broke, you fixed it. The worst ones were the ones that *almost* worked. The ones where the numbers came out nearly right, every time, so that you never quite noticed they were wrong. You built on top of them. You built whole systems on top of them, for months, years, and then one day somebody asked a stupid question and you looked down and realised the whole thing had been standing on a crack the entire time.

He'd been thinking about that all year.

Because something about this world had been *nearly right* from the start. He'd felt it in the summoning hall, the first time he opened his window and saw a status screen that looked like it had been designed by someone who'd played too many MMOs. He'd felt it every time a native said *status* or *inventory* in that careful foreign accent, like a word learned from a book. He'd felt it every time Thea wrote to him about the structure under the windows, the patches on patches, the code written by someone who thought like a gamer but had never shipped anything in his life.

Nearly right. Nearly. And underneath, somewhere, a crack.

He'd never found it. He'd looked. He'd filled three notebooks looking.

And then, on a hot afternoon a week before the end of summer, a rider in the king's colours brought him a letter from Wrenhaven, numbered four, sealed with one of Cursiffe's blue strips, and in it Thea told him exactly where to look.

***

*Chris. Number four. Please check your window. Go under the channel. Every message has a tail; every tail has two numbers. The second one is a date, in English. Tell me what it says. Tell me what it said the day the channel opened. Tell me if I'm wrong.*

*Please don't put this in the channel. Not yet. I'll explain when I can.*

*If I'm right, it's the best news any of us have had all year. I just need to be sure before I tell everyone their mums have only been looking for a month.*

He read it at the table by the window of the Broken Lance, where he always sat. Then he read it again. Then he put it down very carefully, squared it to the edge of the table, the way he squared everything when he needed to think, and opened his window.

He couldn't see what Thea could see. Nobody could; that was Thea's gift, Parse, reading the world like code. But he'd been staring at his window for a year. Logging it. Cross-referencing it. Treating it like the strangest piece of software he'd ever been handed, which it was. And over the year, the way you learn the shape of a codebase you've been living in, he'd learned that if he went very still and looked very hard at the edges of things, sometimes the window would show him a little more than it meant to.

He went still. He looked at the channel. At the last line in it, a goodnight from Maigo. At the very end of the line, where there was nothing.

It took him an hour. He found it.

***

Two numbers. Faint, like a watermark. Hanging off the end of Maigo's goodnight like the tail on a kite.

The first one was three hundred and fifty-eight.

He knew that number. He had it written in the front of his first notebook, on a page he updated every morning: *days since the hall*. Three hundred and fifty-eight. He'd written it that morning.

The second one wasn't a number. It was a date. A month, in full, in capitals. A day. A year. English.

Chris knew the date.

He knew exactly what he'd been doing on it. He'd been at his desk, at work, at eleven at night, because the build had been broken for two days and he was the only one who could fix it. He'd fixed it, finally, around half past ten. He'd written a commit message, and he hadn't pushed it, because he wanted to test it once more in the morning. And he'd gone home, and logged on, and joined Yan's call to play something for an hour, and the floor had gone soft.

He'd thought about that commit a lot. Sitting there on someone's machine, unpushed. The build still broken, for everyone else, because he'd wanted to test it once more in the morning.

The date in his window was a month and four days after that night.

***

He sat at the table by the window of the Broken Lance for a long time, not moving.

Then he did what he always did. He got out a fresh page, and wrote it down, step by step, the way you'd write up a bug.

*Observed: second timestamp on each message in channel. Format: Earth date (English).*

*Value on first channel message (per Thea): day we left.*

*Value now: day we left + 34 days.*

*Days elapsed here (per notebook): 358.*

*Ratio: 358 / 34 ≈ 10.5. Thea says ~11. Close enough given rounding; check again tomorrow.*

*Interpretation: something in the windows is keeping Earth time. Earth time runs about one day for every eleven of ours.*

He looked at it. He wrote, underneath:

*At home it has been about a month.*

And then he put the pencil down, because his hand was shaking.

***

He could have stopped there. He knew that. Thea had asked him a question, and he'd answered it. *Tell me if I'm wrong.* She wasn't wrong. He could write back and say so, and seal it, and send it, and go and sit with the others and not say anything, and let Thea decide what to do. That was what she'd asked for. *Please don't put this in the channel. Not yet. I'll explain when I can.*

But Chris was a debugger. And a debugger never stops at the first bug. You find one, and you look at it, and you ask: *what else has been standing on this?*

What had been standing on *it's been a year*?

He knew. He didn't even have to think about it. He'd been there in the channel, in the spring, when Hana and Milli and half of Group 2 had said it, over and over, about the books and the Latin and the voice. *It can't be him. The Hero's been here twenty years. Ice died three years ago.*

The whole argument had been standing on one assumption. That a year was a year. That three years there was three years here.

Chris picked the pencil up again. He wrote, very small, at the bottom of the page:

*3 years × 11 ≈ 33. Call it 34.*

He looked at it for a long time.

Then he drew a line under it, and closed the notebook, and went upstairs to find Winter.

***

He didn't tell her what he'd worked out. He told her what Thea had found.

She was on the roof, of course. She went up there most evenings now, since the festival; sometimes alone, sometimes with Ina, the two of them on either side of the chimney, not saying much. Tonight she was alone, in her blanket, with her white hair loose and her mismatched eyes on the sunset over the Lists.

He sat down on the other side of the chimney and told her. The slow clock. The date. A month and four days.

Winter didn't say anything for a long time.

"Vietnam," she said at last.

Chris looked at her.

"I was offline for two months," said Winter. "When he died. Two months, and when I came back, everything had already happened." She was looking at the sky. "I've been thinking about my mum all year the way I thought about that. That I'd been gone a whole year, and she'd had a whole year of it, and I'd missed it all. That I'd go home and everything would already have happened." She swallowed. "A month. She's only had a month."

"Yeah."

"That's nothing. That's less than Vietnam."

"Yeah," said Chris.

Winter laughed, a small wet sound, and wiped her eyes with the corner of the blanket.

"Thea's going to post it?"

"She asked me to check first. I'm writing back tonight." He paused. "I'm telling her to post it."

Winter looked at him round the side of the chimney. She'd always been able to see through him. She'd been able to see through him the first week of Apex, back home, when he'd been pretending he wasn't nervous about playing with someone as good as Ice.

"There's something else," she said. "Isn't there."

"I don't know," said Chris. Which was true. "Ask me tomorrow."

***

He wrote to Thea that night. One page.

*Thea. Number five.*

*You're not wrong. I found it. Mine says the same date, the day we left, and today it's a month and four days after. My notebook says 358 days here. Ratio about eleven to one; I'll keep checking.*

*Post it. Everyone's families matter more than anything else. Everyone needs to know.*

*I think I know why you waited. I think I've done the same sum you have. I don't know what you know that I don't. You don't have to tell me. But you can't stop thirty people doing the sum once they've got the numbers, and you shouldn't try. It isn't yours to sit on.*

*It isn't anyone's.*

*C.*

He sealed it with a blue strip, and took it down to the king's rider himself, and stood in the yard of the Broken Lance under the stars for a long time after the rider had gone.

***

Thea posted it two days later. In the evening, when everyone was most likely to be reading.

Chris was at the table by the window with the others round him: Winter, Newish, Hako with his Ice book, Ina with his mask on the back of his chair. He'd told them that afternoon that something was coming. He hadn't told them what.

[ Althea: Rule three. Good news, loudly. I've been sitting on this for a week because I needed to be sure. Chris checked it for me. I'm sure.
Althea: Every window keeps two clocks. One counts days here. The other one is in English and it's a date. It started on the day we left home.
Althea: It runs slow. About eleven of our days for every one of its.
Althea: It's been nearly a year here.
Althea: At home, it's been a month. ]

For a moment the channel was completely still.

Then it broke.

***

Chris had never seen anything like it. Not in the channel, not anywhere. Thirty-five people, all over the kingdom, all reading the same five lines at once, and all of them, at the same moment, thinking the same thing.

*Mum.*

[ Suzuyun: A month.
Suzuyun: She's only been looking for a month.
Suzuyun: I thought she'd had a year. I thought I'd left her alone with them for a year.
Rachael: A MONTH
Rachael: my mum. my mum's only been worrying for a MONTH
Kei: Hisui says I've stopped breathing. I'm breathing. I'm fine. A month.
Newish: wait wait wait so if i go home in like ten years
Newish: it's been less than ONE
Newish: my nan won't even have noticed
Tiger: THAT'S THE BEST NEWS I'VE EVER HEARD
Hanarisu: Thea. Thank you. Thank you. ]

Beside him, Newish had her hands over her mouth. Hako had put his pencil down. Ina was sitting very still, with his eyes closed, and his lips moving slightly, as if he were saying someone's name.

And in the middle of all of it, from the capital:

[ Milli: If ten years here is less than a year there, the way home isn't a rumour anymore.
Milli: It's a plan.
Milli: It's a real plan. Ten years. Twenty. We'd go home and it'd be one year. Two.
Milli: I've been looking for proof all year that the door's there. This isn't proof of the door. But it's proof it's worth looking for.
Milli: Thank you, Thea. ]

Chris read that one twice. He'd always liked Milli. Milli was the one who asked for receipts.

***

It went on like that for an hour. Joy, mostly. Tears, some. People telling each other about their families, their mums, their dogs, their jobs, the things they'd thought were lost and suddenly weren't. Calvin worked out that his gym membership was still valid. Dennis worked out that his rent was only one month overdue, and said so, at length, with a level of relief that made Chris laugh out loud. Maigo worked out that the new season of a show he'd been waiting for hadn't even come out yet, and wrote it in capitals.

Chris watched it all with his notebook open in front of him. He wasn't writing. He was waiting.

He knew somebody would do the sum. He'd known since he wrote it on the bottom of his page. He just didn't know who.

It was Malcolm.

***

[ Malcolm: I need to say something and I need everyone to read it slowly.
Malcolm: IF a month there is a year here,
Malcolm: THEN three years there is about thirty-four here.
Malcolm: Declan died three years ago.
Malcolm: Everyone said it couldn't be him because the Hero's been here twenty years and more.
Malcolm: THEN that isn't a reason anymore. ]

The channel went still.

Chris watched it. He watched the forty lines sit there with Malcolm's six at the bottom, and nothing under them. He watched Winter, beside him, turn very slowly to look at him. He watched Newish take her hands off her mouth.

"Chris," said Hako quietly. "Is that... did you..."

"Yes," said Chris. "On Tuesday. Bottom of the page."

Nobody at the table said anything else.

***

It took a long time for the first answer to come. When it came, it was from Kingsferry.

[ Gabe: it's him. ]

Just that. Then, a moment later:

[ Gabe: i said it when aleaka posted the nets. everyone said it can't be.
Gabe: it can be.
Gabe: it's him. ]

And then everyone at once.

[ Aleaka: I knew his voice. I told you. I knew his voice.
Xavier: Petra told me something two weeks ago that I didn't put in here. I'm putting it in now.
Xavier: She said the Black Blade talked under his breath before he moved. Three or four words. Not our language. Not any language she knew. The same every time. She thought it was a prayer. Now she thinks it was a joke.
Xavier: You all know who did that.
Suzuyun: When the cold one died, I felt what killed it. I couldn't feel it properly. It was too big.
Suzuyun: The sword reached Cinderhold last week. I touched the grip. It's in the iron. The same thing. The same size.
Suzuyun: Whoever killed that demon held that sword. ]

[ Jared: Trust.
Jared: That's all I've got. Trust. I've had it since the third week. I should have said it louder.
Cursiffe: Fast jokes. Faster than anyone. Here or there. I wrote that in Hako's book. I meant it more than I said.
Hanarisu: I ruled it out in the winter because of the timeline. I'm sorry, Leaka. I was wrong. ]

Chris read all of it, and the line from Yan last of all, twice. *Whoever killed that demon held that sword.* He thought about the Advisor's letter that Lucan had read to them before midsummer. *Something came for the summoned at Wrenhaven. It is dead.* It hadn't said how. He'd noticed that at the time. So had Ina.

He looked at Ina. Ina was already looking at him.

"Wrenhaven," said Ina quietly.

"I know," said Chris.

***

And then Milli. From the capital. Last of all.

Chris had been waiting for it. He thought everyone had. Milli had been the one saying no all year, steadily, calmly, in every argument, the way you need someone in every argument to say no. *It doesn't fit.* He'd said it in the channel in the spring, and said *I'm sorry, someone has to say it*. He'd been right to. Chris had agreed with him.

[ Milli: I've been the one saying it doesn't fit. All year. I meant it every time.
Milli: It fits.
Milli: I'm sorry. It fits. ]

Chris closed his eyes.

***

They argued about it, after that. Of course they did. Thirty-five people. They argued about whether it was really him, and how, and *when*. Thea had said nothing since her five lines; nobody seemed to notice. Kei asked, very gently, how a man who died at twenty-six could be writing books about a daughter old enough to boss him about his nets, and Tiger said *maybe he came as a baby, like in the isekai stories*, and for a moment nobody laughed, because for once it didn't sound stupid.

They argued about the Advisor. Wendy, sharp: *He knew. He has to have known.* RX: *Or he didn't. Nobody knew where the Hero came from. That's the whole point.*

And they argued about where.

That was the one nobody could answer. North, said Aleaka; the books came down from the north. North-west of the Redmarch, said Yan; that was where the cold one had died. Somewhere along a long line on Aldous's map that went through half the kingdom. Somewhere a trader picked up a book every spring.

[ Tiger: so where IS he
Hyvred: I can see further than anyone now. I've never seen anyone with light like that. Not once.
Maigo: WHERE IS HE THOUGH
Newish: has anyone asked the advisor
Wendy: Has anyone asked the advisor and got an answer that wasn't "he has given enough"
Newish: fair ]

Nobody knew. Nobody had any idea. They went round and round it for an hour, and it came out the same every time. North, maybe. Somewhere. A man with a sword and a sense of humour and a daughter who bossed him about his nets.

Somewhere.

And then, very late, when the arguing had worn itself out, from Kingsferry:

[ Gabe: declan. if you can somehow read this.
Gabe: i don't care where you are. i don't care how.
Gabe: i'm coming to find you.
Deston: Me too. ]

***

Chris noticed it, in the end, the way he'd noticed the bug. Not by looking for it. By looking at everything else, and seeing where the numbers didn't add up.

Wrenhaven had gone quiet.

Not silent. Xola had written, early on, about her mum: four lines, all capitals and crying faces. PenguChi had written *☺ there's still time*. Gigichi had written *go to sleep, all of you* at some point, very late, and been ignored. But Thea, who'd posted the news, who'd built the channel, who answered everything, hadn't written a word since. And Higu, who'd made the rules, who always said exactly the right calm thing at exactly the right moment, hadn't written anything at all.

Not about the clock. Not about Malcolm's sum. Not about Gabe. Not about where.

In the busiest hour the channel had ever had, two of the five people who lived furthest north had said nothing whatsoever.

He looked up. Winter was looking at him.

She'd seen it too. Of course she had. *I'm not going to be the last to know anything again.* She'd said that in the winter. She'd meant it.

She didn't say anything. She just looked at him, across the table, with her mismatched eyes. And then, very slightly, she shook her head.

*Don't*, it meant. *Not here. Not in the channel.*

Chris nodded.

***

Later, when the others had gone up, he stayed at the table with his notebooks. Winter stayed too. Ina, after a moment's hesitation, sat down at the end of the bench, and Hako came back down in his shirt with the Ice book under his arm, and Newish was still in the big chair by the fire, curled up, not asleep.

"Wrenhaven," said Winter quietly.

"I know," said Chris.

"They know something."

"I think so."

"Thea and Higu." Winter pulled her blanket tighter. "They haven't said a word. Not one. All night. Thea built the thing." She looked at him. "Are we going to ask?"

Chris thought about it for a long time.

He thought about Thea's letter. *Please don't put this in the channel. Not yet. I'll explain when I can.* He thought about the fact that she'd sat on the best news anyone had ever had for a week, because of what came after it. He thought about Rule five, which Higu had mentioned once in passing and never explained. *We just don't write that one down.*

He thought about a man who'd been in this world thirty-four years, and never once told anyone where he came from, as far as anyone knew.

"No," he said. "Not yet."

Winter looked at him.

"If they know something, they've got a reason for not saying," said Chris. "Thea doesn't sit on things. Higu doesn't sit on things without a reason. If they're sitting on this, it's because somebody asked them to, or because it isn't theirs." He looked down at his notebook. "And if he's alive, and he's been alive all this time, and nobody knew where he was..." He stopped. "Then maybe that's because he didn't want anyone to know. Yet."

"So we wait," said Winter.

"So we wait."

"I hate waiting."

"I know."

Winter was quiet for a while. Then she laughed, a little, under her breath.

"*One down,*" she said. "Three years one down. And all the time he was just..." She shook her head. "Somewhere."

***

Hako opened the Ice book on the table.

Twenty-three pages, now forty. He'd kept adding to it all summer: every story anyone wrote in the channel, every scrap. The kettle and the choir and the ban poem. The nets. *Trust.* The Latin. He turned to the last page, which was blank, and took out his pencil, and sat with it over the paper for a long time.

Then he wrote, in the middle of the page, in small careful letters:

*He's alive.*

And under it, smaller:

*I think.*

He looked at it. Then he crossed out *I think*, very neatly, with one line, the way Chris crossed things out in his logs. And closed the book.

Newish, in the chair by the fire, made a sound. Chris looked round. She was crying, silently, with her knees pulled up and her face turned to the fire.

"Newish?"

"I said *rude*," said Newish. Her voice was thick. "Last thing. I said *rude*, and he left the call, and I've been sorry for a year." She wiped her face with her sleeve. "And he's *alive*. Somewhere. Probably. And if I ever see him again, I'm going to say it again." She laughed, wetly. "I'm going to walk right up to him and say *rude*, and then I'm going to hit him."

"That seems fair," said Ina gravely.

"It's *very* fair."

***

Chris sat up after they'd all gone. He didn't sleep. He wasn't tired.

He opened the ALL GROUPS notebook. The big one. The one with thirty-five columns ruled across every double page, one for every one of them, and a year of numbers running down each one. Thea's, climbing steadily from the first week. Maigo's, leaping in the spring. PenguChi's, one percent a week, then seven in a day. All of them. Every single one he'd been able to get. Thirty-five columns of people climbing.

He turned to a fresh double page.

He ruled the thirty-five columns, the way he always did. He wrote the names at the top. And then, very carefully, at the right-hand edge of the page, he ruled one more.

A thirty-sixth column.

He didn't write a name at the top of it. He didn't know what name to write. *Ice*, maybe. Or something else. Whatever this world called him. He didn't know.

He left it blank. Just the lines, ruled down the page, empty, waiting.

He'd wanted to meet Ice in person, one day. He'd had a whole plan, back home. He'd never told him. He was going to save up and fly to Malaysia and just turn up, without telling him, and walk into wherever Ice was and say *hello, I'm Chris*, and watch his face.

He looked at the empty column for a long time.

*Maybe*, he thought. *Maybe I still will.*

He closed the notebook, and put the pencil on top of it, squared to the edge of the cover, and sat in the window of the Broken Lance until the sky went grey over the Lists.

***

A long way to the north, at the end of a jetty on a dark lake, a man had been reading the whole time.

Every line.
