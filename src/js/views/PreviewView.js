import icons from 'url:../../img/icons.svg';
import View from './View.js';

export default class PreviewView extends View {
    _generatePreviewMarkup(preview) {
        return `
            <li class="preview">
                <a
                    class="preview__link ${
                        preview.id === window.location.hash.slice(1) ? `
                            preview__link--active
                        ` : ''
                    }"
                    href="#${preview.id}"
                >
                    <figure class="preview__fig">
                        <img
                            src="${preview.image}"
                            alt="${preview.title}"
                        />
                    </figure>

                    <div class="preview__data">
                        <h4 class="preview__title">
                            ${preview.title.length > 28 ? `${preview.title.slice(0, 28)} `.padEnd(32, '.') : preview.title}
                        </h4>
                        <p class="preview__publisher">
                            ${preview.publisher}
                        </p>
                        <div class="preview__user-generated ${
                            preview.key ? '' : 'hidden'
                        }">
                            <svg>
                                <use href="${icons}#icon-user"></use>
                            </svg>
                        </div>
                    </div>
                </a>
            </li>
        `;
    }

    _generateMarkup() {
        return this._data.map(this._generatePreviewMarkup).join('');
    }
}
