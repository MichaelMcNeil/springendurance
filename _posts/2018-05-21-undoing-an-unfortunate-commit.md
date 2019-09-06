---
layout: post
title: "Undoing an Unfortunate Commit"
date: 2018-05-21
categories: ubuntu linux terminal git
---

Sometimes you make a mistake and accidentally force commit a whole load of files that really shouldn't have been committed...

Sometimes you need a way to undo your commit...and regain confidence that you aren't a scrub.

Here you go...

{% highlight shell %}
git reset HEAD~
{% endhighlight %}

This will undo everything that has just been committed without actually changing any of your files. _But beware_, this should only be entered if you haven't yet pushed your files off to the server.

In case you committed early and want to add something else, you can do a soft reset.

{% highlight shell %}
git reset --soft HEAD~
{% endhighlight %}

Now you can continue adding to the files previously staged.

Enjoy! :)
