# Sort PhraseApp locales

Say you're using [PhraseApp](https://phraseapp.com/) for your localization workflow, with JSON as your localization file format.
Your fellow developers add and remove translation keys which get synced to PhraseApp,
and PhraseApp creates pull requests against your repository whenever new translations come in.
For this workflow to work flawlessly, you need to ensure that your locales are always sorted the way PhraseApp will sort them.

```bash
# test for correct sorting (exit code > 0 upon wrong sorting)
sort-locales path/to/file1.json path/to/file2.json

# sort everything in place
sort-locales path/to/file1.json path/to/file2.json --fix
```
