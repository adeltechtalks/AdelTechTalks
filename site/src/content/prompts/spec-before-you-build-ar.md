---
title: 'حوّل فكرة غامضة إلى شيء قابل للبناء'
description: 'الـprompt الذي أشغّله قبل أي جلسة Vibe Coding، حتى يكون أول ما أبنيه هو الشيء الصحيح لا الشيء الأسرع.'
date: 2026-08-15
lang: ar
translationOf: spec-before-you-build
topic: building
category: building
series: vibe-coding
part: 2
tags: ['vibe coding', 'تخطيط']
minutes: 3
prompt: |
  You are helping me turn a rough product idea into a spec I can build from
  today. Do not write any code yet.

  The idea: [DESCRIBE THE IDEA IN TWO OR THREE SENTENCES]
  The person it is for: [WHO, SPECIFICALLY — NOT "USERS"]
  What has to be true for it to be worth building: [YOUR ONE SUCCESS CONDITION]

  Work through this in order and stop at the end of each section so I can
  correct you before you build on top of a wrong assumption.

  1. Play the idea back to me in your own words, in under 80 words. If any part
     of it is ambiguous, say which part and give me the two readings.
  2. List the assumptions you would have to make to build it. Mark each one
     CHEAP TO TEST or EXPENSIVE TO BE WRONG ABOUT.
  3. Propose the smallest version that would genuinely answer my success
     condition. Not an MVP in the abstract — name the screens, the data it
     stores, and what it deliberately does not do.
  4. Tell me what you would build first and why that order, in one paragraph.
  5. Name the one thing most likely to make this harder than it looks.

  Be blunt in step 5. If you think the idea does not clear its own success
  condition, say so there and explain why rather than building it anyway.
variables:
  - '[DESCRIBE THE IDEA IN TWO OR THREE SENTENCES]'
  - '[WHO, SPECIFICALLY — NOT "USERS"]'
  - '[YOUR ONE SUCCESS CONDITION]'
related:
  - gearnest-ar
---

> الـ[[prompt]] نفسه مكتوب بالإنجليزية عن قصد. هذه هي اللغة التي ضُبِطت عليها
> صياغته، وترجمتها تغيّر سلوك النموذج. الشرح حولها بالعربية.

## متى أستخدمه

في بداية أي بناء، قبل أن يوجد ملف واحد. مشكلة الـ[[Vibe Coding]] ليست الكود
السيئ — الكود غالباً سليم. المشكلة أن تصل إلى برنامج يعمل، ويحلّ مشكلة لم تفكّر
فيها كفاية. وهذا خطأ أغلى بكثير، لأنه يبدو تقدّماً طوال الطريق.

خمس عشرة دقيقة مع هذا الـ[[prompt]] وفّرت عليّ مراراً نهاية أسبوع كاملة في بناء
الشيء الخطأ بإتقان.

## لماذا صيغ هكذا

**يمنع كتابة الكود.** التعليمة موجودة لأنك بدونها ستحصل على شجرة ملفات مقنعة في
أول رد، وستبدأ بتعديلها، ولن يحدث التفكير أبداً.

**يتوقّف بين الأقسام.** النموذج الذي يخطئ في الخطوة الثانية سيخطئ بثقة في
الثالثة والرابعة والخامسة، وكل خطوة تجعل رؤية الخطأ أصعب. تصحيحه مبكراً هو
القيمة كلها.

**الخطوة الخامسة تمنحه إذناً بالاعتراض.** بدونها تحصل على خطة مبتهجة لأي شيء
طلبته. ومعها قد يُقال لك أحياناً إن فكرتك لا تجتاز شرطك أنت — وهذا أثمن مما
فوقه كله.

## أين يخطئ

يوسّع الخطوة الثالثة كل مرة تقريباً. «أصغر نسخة» تعود بضعف المساحة التي كنت
سأختارها. صرت أقرأ تلك الخطوة وأنا أعرف أنني سأحذف نصفها، وأحذف النصف الموجود
لجعل العرض يبدو مكتملاً.

وهو ضعيف أيضاً حين يكون شرط النجاح رخواً. أعطه «أن يعجب الناس» وسيصير كل المخرج
غامضاً. الـ[[prompt]] بحدّة ذلك السطر وحده، فاصرف وقتك هناك.
