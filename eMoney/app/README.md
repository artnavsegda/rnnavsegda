## Описание структуры приложения

- `/doing` - набор групп методов для для работы с внешним API и изменения состояний главного хранилища состояний приложения. `doing.api` - service rest API groupd, `doing.{...}` - groups for local actions
в рамках Redux это actions

- `/constants` - константы для функционирования приложения и тд

- `/components` - общие компонеты UI

- `/reducers` - редьюсеры Redux

- `/resources` - ресурсы (изображения и тд)

- `/screens` - экраны приложения, у экрана могут быть описаны компоненты (используемые исключительно внутри данного экрана, расположенные в каталоге экрана)

- `/themes` - темы приложения и компоненты для их работы

- `/utils` - вспомогательные методы 
