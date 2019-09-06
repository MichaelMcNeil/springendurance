---
layout: post
title: "Learning to Minecraft Admin: Part 2"
date: 2019-09-03
categories: ubuntu linux minecraft admin server
---

Mistakes have already been made. Late last night I got a message that the server wasn't logging anyone in. The error codes indicated that connections couldn't be made to Mojang's auth servers, but a friend was able to login to other servers, and I could login to my account page on Mojang's website.

Immediately I assumed a RAM issue because our server is small. It's 2G and minecraft typically consumes 50-60% of that. free -m didn't show anything unusual. But it was unusual that I had to type in the full command. Tab-completion was throwing an error everytime I tried to use it, and the server seemed sluggish.

So...

{% highlight shell %}
df -h
{% endhighlight %}

<img style="width: 100%;" src="/assets/hd-full.png">

Oops. When I scheduled the hourly backups with cron, I didn't think to see how large a backup was, nor did I consider the servers 25G limit. We were maxed out. Deleting a few of the backups followed by a server reboot and everything was running smoothly again. But I clearly needed to rethink my backup strategy. What did I NEED to backup to safely recover a server instance, and how often did I really need to do it.

What constitues a minecraft server instance? I couldn't actually find any documentation online so I just used a bit of common sense to start pulling things out.

After a bit of thought I came up with the following directory structure.

- minecraft
  - servers (each server gets its own directory)
  - backups (same as above)
  - jars (not every server needs access to each version of vanilla or bukkit)
  - bin (scripts that I'll use to admin the different instances)

So I created a 'rof' (Realm of Fyp) directory in servers and backups. Moved all the relevant configs, plugins, and logs to 'rof'. I then recreated the sym link to the version of bukkit that I'm using in the jars directory.

{% highlight shell %}
cd /minecraft/servers/rof
ln s ../../jars/bukkit.jar minecraft_server.jar
{% endhighlight %}

I edited the run and loop scripts to target the appropriate directory and create a screen session based on the name of that server.

{% highlight shell %}
#!/bin/sh
screen -s rof -dm bash -c "./loop"
{% endhighlight %}

{% highlight shell %}
#!/bin/sh
while true
do
sudo java -Xmx1900M -jar /root/minecraft/servers/rof/minecraft_server.jar nogui
echo "If you want to completely stop the server process now, press Ctrl+C before the time is up!"
echo "Rebooting in:"
for i in 5 4 3 2 1
do
echo "\$i..."
sleep 1
done
echo "Rebooting now!"
done
{% endhighlight %}

I started the server and logged into the minecraft world only to see that NOTHINGwe had created existed anymore and it was a fresh world. WHAT GIVES! I checked the contents of the minecraft directory and realized that all our worlds had been recreated in the top level directory instead of using the instances that I had copied to /servers/rof.

Weirdly enough, minecraft will read the configs from the directory in which minecraft_server.jar exists, but it won't use the world instances unless the java -jar command is actually called from that same directory. Thus, minecraft will always use the world files from the pwd when java is run, and create new ones if they don't exist.

Easy enough. Before executing my while loop...

{% highlight shell %}
#!/bin/sh
cd servers/rof
while true
---- run the java stuff
{% endhighlight %}

But still, the code needed a bit more refactoring. What if I wanted more server instances than just 'rof' and I wanted to use my same run, loop, and backup scripts to execute them? Well I just needed to edit the scripts to accept the name of the server as an argument.

run (passes the server name onto loop)
{% highlight shell %}
#!/bin/sh
screen -s "$1" -dm bash -c "./loop $1"
{% endhighlight %}

{% highlight shell %}
#!/bin/sh
cd /root/minecraft/servers/$1
while true
do
sudo java -Xmx1900M -Dlopg4j.configurationFile=/root/minecraft/servers/$1/log4j2.xml -jar /root/minecraft/servers/$1/minecraft_server.jar nogui
echo "If you want to completely stop the server process now, press Ctrl+C before the time is up!"
echo "Rebooting in:"
for i in 5 4 3 2 1
do
echo "\$i..."
sleep 1
done
echo "Rebooting now!"
done
{% endhighlight %}

Now I can exectue these scripts on different servers without having to refactor. Next up, I'd like to automate the server creation process and perhaps expose these functions over http endpoints.

And finally, a keen eye would have also picked up on the addition of...
{% highlight shell %}
-Dlopg4j.configurationFile=/root/minecraft/servers/\$1/log4j2.xml
{% endhighlight %}

Well.....that's for the next post, and is a solution I've found to deal with the RIDICULOUS amount of log spam all these minecraft plugins generate. How do you weed out all the junk so that you can actually debug the server?
