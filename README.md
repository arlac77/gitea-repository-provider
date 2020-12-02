[![npm](https://img.shields.io/npm/v/gitea-repository-provider.svg)](https://www.npmjs.com/package/gitea-repository-provider)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/gitea-repository-provider)](https://bundlephobia.com/result?p=gitea-repository-provider)
[![downloads](http://img.shields.io/npm/dm/gitea-repository-provider.svg?style=flat-square)](https://npmjs.org/package/gitea-repository-provider)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# gitea-repository-provider

repository provider for gitea

# usage

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [GiteaProvider](#giteaprovider)
    -   [headers](#headers)
    -   [repositoryBases](#repositorybases)
    -   [name](#name)
-   [GiteaBranch](#giteabranch)
    -   [commit](#commit)
        -   [Parameters](#parameters)
-   [GiteaContentEntry](#giteacontententry)
    -   [Parameters](#parameters-1)
-   [GiteaMasterOnlyContentEntry](#giteamasteronlycontententry)
    -   [Parameters](#parameters-2)
-   [GiteaPullRequest](#giteapullrequest)
    -   [list](#list)
        -   [Parameters](#parameters-3)
-   [GiteaOrganization](#giteaorganization)
-   [GiteaUser](#giteauser)

## GiteaProvider

**Extends MultiGroupProvider**

Gitea provider
Known environment variables

-   GITEA_TOKEN api token
-   GITEA_API api url

### headers

Fetch headers

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** suitable as fetch headers

### repositoryBases

All possible base urls

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** common base urls of all repositories

### name

We are called gitea.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** gitea

## GiteaBranch

**Extends Branch**

### commit

Commit entries

#### Parameters

-   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** commit message
-   `updates` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Entry>** file content to be commited
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Commit** 

## GiteaContentEntry

**Extends BufferContentEntryMixin(ContentEntry)**

works for all branches

### Parameters

-   `branch`  
-   `name`  

## GiteaMasterOnlyContentEntry

**Extends StreamContentEntryMixin(ContentEntry)**

only works for master branch

### Parameters

-   `branch`  
-   `name`  

## GiteaPullRequest

**Extends PullRequest**

### list

List all pull request for a given repo
result will be filtered by source branch, destination branch and states

#### Parameters

-   `respository` **Repository** 
-   `filter` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
    -   `filter.source` **Branch?** 
    -   `filter.destination` **Branch?** 
    -   `filter.states` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?** 

Returns **Iterator&lt;PullRequest>** 

## GiteaOrganization

**Extends RepositoryGroup**

## GiteaUser

**Extends RepositoryGroup**

# install

With [npm](http://npmjs.org) do:

```shell
npm install gitea-repository-provider
```

# license

BSD-2-Clause
