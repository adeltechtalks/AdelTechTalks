---
title: 'اقتطع من النطاق دون أن تقتطع المقصد'
description: 'للأسبوع الذي يسبق موعد التسليم، حين يجب أن يُحذف شيء ويبدو كل شيء ضرورياً.'
date: 2026-08-05
lang: ar
translationOf: cut-the-scope
topic: product
category: product
tags: ['product', 'الشحن']
minutes: 2
prompt: |
  I am going to miss a deadline unless I cut something. Help me cut the right
  thing rather than the easy thing.

  What I am shipping: [THE THING, IN ONE SENTENCE]
  The deadline and why it is real: [DATE, AND WHAT HAPPENS IF IT SLIPS]
  Everything currently in scope: [LIST IT ALL — INCLUDE THE SMALL ITEMS]
  The one thing this has to do to be worth shipping at all: [THE CORE PROMISE]

  For every item in scope, sort it into exactly one of:

  · LOAD-BEARING — the core promise breaks without it
  · VISIBLE — noticed if missing, but the promise still holds
  · INVISIBLE — nobody outside the team would notice this week

  Then:

  1. Give me the cut list, INVISIBLE first, with the honest cost of each cut.
  2. Name anything I have put in scope that is not serving the core promise at
     all. This is usually the real answer and it is usually something I am
     attached to.
  3. Tell me which single VISIBLE item, if cut, buys the most time for the least
     damage — and what I would tell someone who noticed it was missing.
  4. If the LOAD-BEARING set alone still does not fit the deadline, say so
     directly instead of finding something else to cut.

  Do not propose doing anything faster or in parallel. The question is what
  leaves the release, not how to work harder.
variables:
  - '[THE THING, IN ONE SENTENCE]'
  - '[DATE, AND WHAT HAPPENS IF IT SLIPS]'
  - '[LIST IT ALL — INCLUDE THE SMALL ITEMS]'
  - '[THE CORE PROMISE]'
---

> الـ[[prompt]] نفسه بالإنجليزية عن قصد — الصياغة مضبوطة عليها، والشرح حولها
> بالعربية.

## متى أستخدمه

في الأسبوع السابق لموعد لا أتحكّم فيه، حين يتضح أن القائمة كلها لن تُنجَز.
ومفيد أيضاً قبل ذلك بكثير، حين يتضاعف النطاق بهدوء ولا يقولها أحد بصوت عالٍ.

## لماذا صيغ هكذا

**ثلاث خانات لا خمس.** أي زيادة وسينتهي كل شيء في الخانة الوسطى. الاختيار
القسري بين «الوعد ينكسر» و«الوعد يصمد» هو ما يُنتج قراراً بدل قائمة مرتّبة.

**يمنع «اعملوا أسرع».** لو تُرك مفتوحاً لتضمّن كل جواب «وازِ هذا» أو «حدّد وقتاً
لذاك». وهي خيارات حقيقية، لكنها ليست هذا السؤال، والسماح بها يعفيك من الاقتطاع
أصلاً.

**النقطة الرابعة هي المهمة.** أحياناً يكون الجواب الصادق أن النواة غير القابلة
للاختزال لا تتّسع للموعد، وأن القرار عن التاريخ لا عن النطاق. والـ[[prompt]]
الذي لا يستطيع إرجاع هذا الجواب سيخترع اقتطاعاً بدلاً منه.

## أين يخطئ

يصنّف بسخاء — تصل أشياء إلى خانة LOAD-BEARING وهي ليست كذلك، خصوصاً كل ما وصفته
أنت بكلمة «أساسي» في مدخلاتك. جرّب كتابة قائمة النطاق بلغة محايدة وسيتحسّن
التصنيف بوضوح.

وهو لا يعرف ما هو رخيص على فريقك. قد يسمّي عنصراً «اقتطاعاً صغيراً» وهو ثلاثة
أيام عمل في مشروعك، فقائمة الاقتطاع اقتراح تُسعّره أنت، لا أمر تنفّذه.
