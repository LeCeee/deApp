#!/usr/bin/env python
# coding: utf-8

# In[ ]:



# In[1]:


import json
import pandas as pd
import matplotlib.pyplot as plt


# In[2]:


tweet_data_path = "./Depression-Sentiment-Analysis-with-Twitter-Data/tweetdata.txt"


# In[3]:


tweets_data = []
tweets_file = open(tweet_data_path,'r')


# In[4]:


for line in tweets_file:
    try:
        tweet = json.loads(line)
        tweets_data.append(tweet)
    except:
        continue


# In[5]:


print(len(tweets_data))


# In[6]:


tweets = pd.DataFrame()


# In[7]:


tweets['id'] = map(lambda tweet: tweet.get('id', None), tweets_data)
tweets['text'] = map(lambda tweet : tweet.get('text', None), tweets_data)


# In[8]:


print(tweets.head())


# In[9]:


print(tweets)


# In[10]:


sent = pd.read_excel('./Depression-Sentiment-Analysis-with-Twitter-Data/sentiment2.xlsx')
print(sent.head())
print(sent['id'])
print(len(sent))


# In[11]:


x = []
y = []
for i in range(len(tweets_data)):
    if tweets_data[i]['id']==sent['id'][i]:
        x.append(tweets_data[i]['text'])
        y.append(sent['sentiment'][i])
print(x[0].split(" "))
print(y[0])

print(x)
print(y)


# In[12]:


tweets_train = pd.DataFrame()

tweets_train['tweets'] = x
tweets_train['sentiment'] = y

tweets_train


# In[13]:


from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn import metrics
from textblob import TextBlob


# In[14]:


blob = TextBlob('Hey, look - I found my social anxiety again. Was wondering where that went.')
blob.sentences
print(blob.sentences[0])


# In[15]:


for words, tag in blob.tags:
    print (words, tag)


# In[16]:


print(blob.sentiment)


# In[17]:


polarity = []
for single_tweet in tweets_train['tweets']:
    print(single_tweet)
    analysis = TextBlob(single_tweet)
    if analysis.sentiment[0] < 0.3:
        polarity.append('Highly Depressed')
    elif analysis.sentiment[0] > 0.3 and analysis.sentiment[0] < 0.5:
        polarity.append('Slightly Depressed')
    elif analysis.sentiment[0] > 0.5 and analysis.sentiment[0] < 0.8:
        polarity.append('Mildly depression')
    else:
        polarity.append('No depression')


# In[18]:


polarity


# In[19]:


len(polarity)


# In[20]:


tweets_train['status'] = polarity


# In[21]:


tweets_train


# In[ ]:





# In[22]:


vectorizer = CountVectorizer(stop_words='english')
train_features = vectorizer.fit_transform(tweets_train['tweets'])

actual = y[:-500]


# In[23]:


nb = MultinomialNB()
nb.fit(train_features, [int(r) for r in y])

test_features = vectorizer.transform(tweets_train['tweets'][:-500])

test_try= vectorizer.transform(["Can we all stop treating anxiety like it's a choice and something cool to have thank you"])
test_try2= vectorizer.transform(["I want to die depression sucks"])

print()

predict2 = nb.predict(test_try)
predict3 = nb.predict(test_try2)


# In[24]:


DATASET_COLUMNS = ["ItemID", "SentimentText"]
DATASET_ENCODING = "ISO-8859-1"
test = pd.read_csv('test.csv', encoding =DATASET_ENCODING , names=DATASET_COLUMNS)


# In[25]:


test
tweet_test = test[1:500]


# In[26]:


tweet_test


# In[27]:


test_features = vectorizer.transform(tweet_test['SentimentText'][:-500])


# In[28]:


test_predict =pd.DataFrame()
print(len(tweet_test['SentimentText']))


# In[47]:


polarity_test = []
for single_tweet in tweet_test['SentimentText']:
    print(single_tweet)
    analysis = TextBlob(single_tweet)
    if analysis.sentiment[0] < 0.05:
        polarity_test.append('Highly Depressed')
    elif analysis.sentiment[0] >= 0.05 and analysis.sentiment[0] < 0.3:
        polarity_test.append('Slightly Depressed')
    elif analysis.sentiment[0] >= 0.3 and analysis.sentiment[0] < 0.8:
        polarity_test.append('Mildly depression')
    else:
        polarity_test.append('No depression')


# In[48]:


print(len(polarity_test))


# In[49]:


test_predict['tweets'] = tweet_test['SentimentText']
test_predict['status'] = polarity_test


# In[50]:


test_predict


# In[58]:


from collections import Counter
import matplotlib.pyplot as plt

target_cnt = Counter(test_predict.status)

plt.figure(figsize=(16,8))
plt.bar(target_cnt.keys(), target_cnt.values())
plt.savefig('plot.png', bbox_inches='tight')


# In[52]:


"""Filename : server.py
"""

import os
from sklearn.externals import joblib
from flask import Flask, jsonify, request


# In[54]:


data = test_predict.to_json(orient='records')


# In[55]:


print(data)


# In[ ]:





# In[ ]:




