[![npm](https://img.shields.io/npm/v/gitea-repository-provider.svg)](https://www.npmjs.com/package/gitea-repository-provider)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/gitea-repository-provider)](https://bundlephobia.com/result?p=gitea-repository-provider)
[![downloads](http://img.shields.io/npm/dm/gitea-repository-provider.svg?style=flat-square)](https://npmjs.org/package/gitea-repository-provider)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/gitea-repository-provider.svg?style=flat-square)](https://github.com/arlac77/gitea-repository-provider/issues)
[![Build Status](https://secure.travis-ci.org/arlac77/gitea-repository-provider.png)](http://travis-ci.org/arlac77/gitea-repository-provider)
[![codecov.io](http://codecov.io/github/arlac77/gitea-repository-provider/coverage.svg?branch=master)](http://codecov.io/github/arlac77/gitea-repository-provider?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/gitea-repository-provider/badge.svg)](https://coveralls.io/r/arlac77/gitea-repository-provider)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/gitea-repository-provider/badge.svg)](https://snyk.io/test/github/arlac77/gitea-repository-provider)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/gitea-repository-provider.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/gitea-repository-provider)

# gitea-repository-provider

repository provider for gitea

# usage

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [GiteaProvider](#giteaprovider)
    -   [headers](#headers)
    -   [repositoryBases](#repositorybases)
    -   [environmentOptions](#environmentoptions)
    -   [areOptionsSufficciant](#areoptionssufficciant)
        -   [Parameters](#parameters)
-   [GiteaBranch](#giteabranch)
    -   [commit](#commit)
        -   [Parameters](#parameters-1)
-   [GiteaContentEntry](#giteacontententry)
    -   [Parameters](#parameters-2)
-   [GiteaMasterOnlyContentEntry](#giteamasteronlycontententry)
    -   [Parameters](#parameters-3)
-   [GiteaPullRequest](#giteapullrequest)
    -   [list](#list)
        -   [Parameters](#parameters-4)
-   [GiteaOrganization](#giteaorganization)
-   [GiteaUser](#giteauser)

## GiteaProvider

**Extends Provider**

Gitea provider

### headers

fetch headers

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** suitable as fetch headers

### repositoryBases

All possible base urls

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** common base urls of all repositories

### environmentOptions

known environment variables

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** GITEA_TOKEN api token

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** GITEA_API api url

### areOptionsSufficciant

#### Parameters

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if token an api are present

## GiteaBranch

**Extends Branch**

### commit

Commit entries

#### Parameters

-   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** commit message
-   `updates` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Entry>** file content to be commited
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

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
