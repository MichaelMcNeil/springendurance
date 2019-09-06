---
layout: post
title:  "Adding Application to Startup in Ubuntu"
date:   2018-05-21
categories: ubuntu linux terminal guake startup
---
Trying out something simple for my first jekyll post.  Leaving myself a reminder on how to launch applications on startup in Ubuntu.

Here's how you would add [Guake](http://www.guake-project.org) to the list of startup applications.

{% highlight shell %}
sudo cp /usr/share/applications/guake.desktop /etx/xdg/autostart
{% endhighlight %}

Find [Guake on GitHub](http://github.com/guake/guake)
