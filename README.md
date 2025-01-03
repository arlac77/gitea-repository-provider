[![npm](https://img.shields.io/npm/v/gitea-repository-provider.svg)](https://www.npmjs.com/package/gitea-repository-provider)
[![License](https://img.shields.io/badge/License-0BSD-blue.svg)](https://spdx.org/licenses/0BSD.html)
[![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript\&label\&labelColor=blue\&color=555555)](https://typescriptlang.org)
[![bundlejs](https://deno.bundlejs.com/?q=gitea-repository-provider\&badge=detailed)](https://bundlejs.com/?q=gitea-repository-provider)
[![downloads](http://img.shields.io/npm/dm/gitea-repository-provider.svg?style=flat-square)](https://npmjs.org/package/gitea-repository-provider)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/gitea-repository-provider.svg?style=flat-square)](https://github.com/arlac77/gitea-repository-provider/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fgitea-repository-provider%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/gitea-repository-provider/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/gitea-repository-provider/badge.svg)](https://snyk.io/test/github/arlac77/gitea-repository-provider)
[![Coverage Status](https://coveralls.io/repos/arlac77/gitea-repository-provider/badge.svg)](https://coveralls.io/github/arlac77/gitea-repository-provider)

# gitea-repository-provider

repository provider for gitea

# usage

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [GiteaBranch](#giteabranch)
    *   [writeEntry](#writeentry)
        *   [Parameters](#parameters)
    *   [commit](#commit)
        *   [Parameters](#parameters-1)
*   [GiteaContentEntry](#giteacontententry)
    *   [Parameters](#parameters-2)
*   [GiteaMasterOnlyContentEntry](#giteamasteronlycontententry)
    *   [Parameters](#parameters-3)
*   [GiteaOrganization](#giteaorganization)
*   [GiteaProvider](#giteaprovider)
    *   [initializeRepositories](#initializerepositories)
    *   [repositoryBases](#repositorybases)
    *   [name](#name)
    *   [instanceIdentifier](#instanceidentifier)
*   [GiteaPullRequest](#giteapullrequest)
    *   [states](#states)
    *   [list](#list)
        *   [Parameters](#parameters-4)
*   [GiteaRepository](#gitearepository)
    *   [update](#update)
*   [GiteaUser](#giteauser)

## GiteaBranch

**Extends Branch**

### writeEntry

Writes content into the branch.

#### Parameters

*   `entry` **ContentEntry**&#x20;
*   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<ContentEntry>** written content with sha values set

### commit

Commit entries.

#### Parameters

*   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** commit message
*   `entries` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<ContentEntry>** content to be commited
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?**&#x20;

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<CommitResult>**&#x20;

## GiteaContentEntry

**Extends BufferContentEntryMixin(ContentEntry)**

works for all branches

### Parameters

*   `name` &#x20;
*   `mode` &#x20;
*   `branch` &#x20;

## GiteaMasterOnlyContentEntry

**Extends StreamContentEntryMixin(ContentEntry)**

only works for master branch

### Parameters

*   `name` &#x20;
*   `mode` &#x20;
*   `branch` &#x20;

## GiteaOrganization

**Extends RepositoryGroup**

## GiteaProvider

**Extends MultiGroupProvider**

Gitea provider.
Known environment variables:

*   GITEA\_TOKEN api token
*   GITEA\_API api url

### initializeRepositories

*   **See**: <https://try.gitea.io/api/swagger#/repository/repoSearch>

### repositoryBases

All possible base urls.

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** common base urls of all repositories

### name

We are called gitea.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** gitea

### instanceIdentifier

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** default env name prefix

## GiteaPullRequest

**Extends PullRequest**

### states

possible states

### list

List all pull request for a given repo.
Result will be filtered by source branch, destination branch and states.

#### Parameters

*   `respository` **Repository**&#x20;
*   `filter` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)

    *   `filter.source` **Branch?**&#x20;
    *   `filter.destination` **Branch?**&#x20;
    *   `filter.states` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?**&#x20;

Returns **AsyncIterable\<PullRequest>**&#x20;

## GiteaRepository

**Extends Repository**

*   **See**: <https://try.gitea.io/api/swagger#/repository/repoGet>

### update

<https://try.gitea.io/api/swagger#/repository/repoEdit>

## GiteaUser

**Extends RepositoryGroup**

# install

With [npm](http://npmjs.org) do:

```shell
npm install gitea-repository-provider
```

# license

BSD-2-Clause
