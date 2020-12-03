// @flow
import React, {memo} from 'react';
import {Svg, G, Path} from 'react-native-svg';
import {themedRender, type Theme} from '../../themes';

export type Props = {
    style?: ?any,
};

type InternalProps = Props & {
    theme: Theme,
};

const Logo = memo(({style, theme}: InternalProps) => (
    <Svg style={style} height={55} viewBox="0 0 255 55" width={255}>
        <G fill="none" transform="translate(-.0002 -.000395)">
            <G fill={theme.colors.primaryText}>
                <Path d="m7.308 41.2263954c.139 0 .494.002 1.088.002.58.001 1.215.003 1.913.004.695.002 1.378.002 2.055.003.669.002 1.18.003 1.532.003.611.002.91-.359.912-1.092-.035-.666-.058-1.906-.055-3.729.004-1.815.009-3.925.013-6.305.005-2.387-.007-4.9-.024-7.538-.018-2.643-.018-5.146-.014-7.505.005-2.357-.008-4.439-.028-6.22899998-.015-1.798-.024-3.026-.022-3.694.001-.664-.025-1.32-.063-1.96-.048-.638-.088-1.296-.135-1.962.001-.617.224-.922.653-.92.875-.052 1.735-.099 2.562-.147.828-.052 1.688-.103 2.567-.152.562-.049.869.236.913.845-.003.616.02 1.951.069 4.003.046 2.043.085 4.447.127 7.19399998.035 2.742.069 5.664.109 8.766.038 3.105.062 5.997.08 8.689.012 2.699.039 5.005.056 6.928.016 1.924.02 3.092.019 3.498.05.774.374 1.14.989 1.081.469-.048.968-.046 1.497.003.526.055 1.004.05 1.439.001.692-.046 1.085.362 1.176 1.231.087 1.387.101 2.78.052 4.164-.04 1.38-.024 2.792.061 4.23 0 .259.012.559.033.885.016.333-.003.682-.072 1.04-.067.363-.168.657-.32.889-.159.225-.407.343-.758.342-.701 0-1.505.021-2.419.074-.917.045-1.614.043-2.084-.004-.834-.155-1.317-.82-1.443-1.997l.002-1.913c.002-.553-.265-.864-.783-.917-.52-.001-1.295-.003-2.312-.004-1.035-.002-2.177.012-3.442.033-1.262.021-2.551.034-3.862.033-1.304-.003-2.53-.006-3.66-.008-1.139-.003-2.082-.02-2.848-.046-.762-.023-1.212-.041-1.339-.043-.482-.15-.804-.451-.985-.891-.174-.433-.304-.93-.387-1.5.001-.253-.008-1.078-.026-2.465-.016-1.387-.03-3.119-.054-5.201-.011-2.075-.016-4.411-.011-6.995.005-2.594 0-5.238-.015-7.928-.021-2.693-.032-5.32-.027-7.88.004-2.57.009-4.874.012-6.92799998.006-2.053-.003-3.743-.014-5.075-.016-1.34-.035-2.08-.035-2.232.001-.512.156-.907.463-1.192.308-.284.666-.42 1.106-.42.563.052 1.233.064 2.011.04.78-.022 1.423-.085 1.945-.195.221-.04.411-.003.586.124.167.129.31.247.383.348.146.204.261.383.351.539l.078 37.22599998c-.047.57-.049 1.054-.003 1.467 0 .354.027.682.098.964.068.274.166.418.29.418" />
                <Path d="m38.2836 8.48999542c-.095.054-.216.167-.365.347-.156.179-.222.317-.224.422.033 1.02599998.064 2.03499998.086 3.00799998.021.97.08 1.973.161 3.003 0 .102.075.227.233.382.15.156.265.234.349.234.655 0 1.337-.015 2.059-.032.716-.028 1.418-.053 2.086-.08.682-.017 1.315-.034 1.904-.032.582.001 1.082.001 1.463.003.79.001 1.319.183 1.601.544.288.359.449.897.487 1.616 0 .567.009 1.131.026 1.7.025.563.014 1.128-.032 1.69-.124 1.033-.832 1.592-2.095 1.692-1.084.098-2.223.114-3.384.034-1.182-.078-2.318-.072-3.409.032-.517.051-.845.166-.952.345-.106.178-.161.578-.163 1.191.042 1.084.06 2.437.057 4.085-.003 1.64-.006 3.249-.009 4.816s-.006 2.966-.01 4.202c-.003 1.224.03 1.951.071 2.155.032.159.127.311.285.463.153.153.296.231.425.232.92.053 2.038.067 3.362.048 1.331-.027 2.629-.037 3.891-.035l4.453.009c.343.052.692.064 1.043.043.35-.029.583.317.71 1.028.045.209.078.573.095 1.116.02.525.039 1.106.039 1.715-.004.613-.024 1.2-.045 1.759-.02.559-.035.936-.035 1.151-.002.401-.118.778-.364 1.105-.237.326-.547.518-.934.568-.269 0-.893-.001-1.875-.003-.969-.001-2.114-.004-3.429-.007-1.31-.002-2.691-.005-4.149-.008-1.464-.003-2.818-.006-4.054-.008-1.233-.003-2.295-.004-3.164-.006-.875-.001-1.354-.003-1.436-.003-.442-.001-.804-.181-1.08-.539-.283-.361-.45-.796-.488-1.309-.039-.614-.059-2.103-.056-4.461.006-2.359.003-5.127-.021-8.313-.009-3.177-.016-6.573-.009-10.195.006-3.61.012-6.988.018-10.121.006-3.124.002-5.80499998-.019-8.03799998-.007-2.229-.019-3.546-.0181577-3.959.0021577-.929.3451577-1.384 1.0401577-1.383.526.002 1.534.003 3.036.006 1.508.003 3.152-.012 4.945-.034 1.781-.025 3.528-.041 5.224-.061 1.699-.024 3.002-.033 3.916-.032 1.787-.101 2.547.901 2.282 3.012-.09.412-.131.831-.131 1.269-.001.437-.003.863-.003 1.269.039.52-.091.966-.398 1.348-.306.389-.696.579-1.172.579-.092 0-.425.009-1.021.034-.584.027-1.286.05-2.116.07-.83.034-1.733.054-2.719.074-.97.024-1.888.052-2.707.074-.826.021-1.548.064-2.156.108-.615.055-.978.078-1.105.078" />
                <Path d="m63.1293.15209542c.178.002.562.526 1.147 1.58.583 1.056 1.242 2.335 1.978 3.849.742 1.513 1.526 3.113 2.351 4.81199998.819 1.696 1.56 3.183 2.209 4.463.528-1.224 1.104-2.649 1.735-4.264.643-1.61399998 1.253-3.14899998 1.843-4.61099998.591-1.46 1.117-2.689 1.573-3.688.459-1.001.801-1.5 1.017-1.5.393-.048.771.055 1.147.316.363.257.745.483 1.142.696.391.201.766.414 1.143.648.365.23.748.456 1.142.659.479.256.768.541.872.849.114.307.059.768-.161 1.38-.266.622-.72 1.655-1.379 3.113-.651 1.462-1.361 3.03299998-2.103 4.72799998-.736 1.688-1.469 3.31-2.197 4.842-.724 1.533-1.277 2.69-1.673 3.455-.222.414-.319.784-.319 1.119-.002.335.095.708.314 1.116.227.412.605 1.16 1.152 2.23.534 1.087 1.144 2.313 1.812 3.702.678 1.384 1.366 2.833 2.085 4.345.713 1.515 1.376 2.904 1.982 4.162.61 1.255 1.324 2.733 2.15 4.428.344.664.6 1.217.741 1.654.164.432.204.829.136 1.196-.065.355-.242.688-.532.991-.272.31-.702.668-1.266 1.081-.356.253-.7.523-1.053.803-.347.283-.697.552-1.043.806-.355.252-.715.318-1.107.188-.396-.125-.696-.422-.918-.879-.21-.415-.529-1.058-.943-1.934-.408-.87-.892-1.857-1.435-2.963-.536-1.101-1.111-2.28-1.724-3.54-.604-1.259-1.182-2.45-1.719-3.579-.548-1.131-1.036-2.174-1.469-3.122-.434-.949-.761-1.658-.978-2.111-.083-.114-.148-.194-.19-.271-.051-.081-.134-.193-.259-.344-.226.401-.648 1.351-1.29 2.838-.631 1.489-1.353 3.144-2.159 4.994-.803 1.852-1.608 3.664-2.401 5.461-.781 1.788-1.421 3.224-1.894 4.307-.265.558-.582.918-.946 1.075-.379.15-.959.095-1.736-.16-1.006-.415-1.936-.924-2.812-1.546-.343-.255-.544-.629-.582-1.113-.045-.492.063-1.018.323-1.577.138-.259.434-.909.892-1.961.459-1.056 1-2.285 1.605-3.693.611-1.408 1.28-2.919 2.002-4.533.72-1.617 1.413-3.137 2.071-4.575.651-1.429 1.232-2.698 1.732-3.802.503-1.102.846-1.858 1.024-2.265.217-.408.348-.77.389-1.081.054-.305-.038-.663-.254-1.074-.48-.977-1.118-2.315-1.922-4.005-.808-1.691-1.605-3.378-2.41-5.042-.804-1.674-1.534-3.18399998-2.178-4.54599998-.656-1.361-1.059-2.192-1.237-2.501-.302-.562-.379-1.043-.227-1.425.153-.381.409-.702.753-.956.308-.258.655-.562 1.044-.926.393-.351.778-.7 1.152-1.032.373-.33.716-.628 1.047-.882.323-.255.595-.385.811-.385" />
            </G>
            <Path
                d="m106.7426 4.12189542c-.166-.002-.335.001-.506.021-1.196.114-2.215.626-2.88 1.45-1.088 1.185-1.676 3.052-1.559 4.89799998.109 1.672.754 3.094 1.83 4.002l.041.033c1.081 1.164 2.45 1.789 3.725 1.738 1.117-.046 2.134-.608 2.932-1.624 1.231-1.525 1.925-3.935 1.709-5.99799998-.098-.956-.438-2.266-1.484-3.11-1.059-.903-2.452-1.409-3.808-1.41m-5.166 38.72699998c1.426 1.588 3.593 2.523 5.932 2.555 1.971-.007 3.804-.601 4.834-1.695 4.091-4.424 5.26-13.542 2.442-19.125-1.313-2.498-3.229-3.988-5.55-4.303-2.35-.322-4.952.675-6.792 2.605-4.341 5.198-4.802 15.466-.866 19.963m5.529 6.7780818c-3.214-.0060818-6.28-1.1510818-8.146-3.0930818-6.158-6.11-5.3-17.886-.412-24.334.783-1.392 2.003-2.804 3.464-3.987-2.434-1.393-4.054-3.887-4.503-6.945-.509-3.49799998.595-6.95099998 2.911-9.01599998 3.669-3.287 10.366-2.361 13.451.596l.011.009c1.876 1.958 2.745 4.977 2.338 8.07999998-.351 2.719-1.649 5.101-3.53 6.522 2.461 1.244 5.363 3.341 6.562 6.587 3.238 8.656.645 18.366-3.626 22.389-2.411 2.223-5.528 3.198-8.52 3.1920818"
                fill={theme.colors.primaryButton}
            />
            <Path
                d="m135.6767 49.9269746c-2.107-.0040792-4.246-.5560792-5.975-1.5700792-4.577-2.655-4.808-9.941-5.007-15.802-.063-1.946-.12-3.631-.322-4.887-.144-1.214.9-1.958 1.992-2.078 1.088-.123 2.252.365 2.378 1.545.214 1.54.285 3.533.368 5.648.171 4.519.378 10.138 2.205 11.554 2.679 2.134 5.851 2.123 8.078-.022 1.741-2.117 3.542-11.461 2.416-18.907-.597-3.95-1.93-6.711-3.864-7.976-3.078-2.136-6.311-1.262-10.057-.253-.923.404-1.827.377-2.412-.085-.37-.289-.773-.879-.589-2.017.181-2.234.018-4.686-.147-7.06399998-.079-1.242-.163-2.426-.189-3.534-.536-.653-.5-1.761-.158-2.584.391-.92 1.099-1.446 1.87-1.401 7.246.346 10.688.052 15.883-.385l.988-.081c.646-.097 1.212.098 1.555.544.461.586.497 1.553.112 2.468-.387.901-1.082 1.496-1.875 1.578h-.035c-1.839.055-3.409.187-4.94.314-2.583.22-5.253.447-9.211.255.04.69.083 1.387.133 2.108.114 1.846.234 3.75299998.252 5.53599998 5.385-1.363 9.255-.91 12.495 1.433 2.8 1.778 4.021 6.055 4.554 9.333 1.326 8.222-.222 19.432-3.182 23.06-1.672 2.268-4.468 3.276-7.316 3.2700792"
                fill={theme.colors.primaryButton}
            />
            <G fill={theme.colors.primaryText} transform="translate(160 11)">
                <Path d="m10.6938 13.5075954c.336.034 1.071.069 1.17.371.035.1-.033.435 0 .669.066.267.066.77-.002 1.037-.035.234.033.535-.002.702l-.134.368c-.067.267.066.502-.169.601-.468.135-1.037-.101-1.471-.002-.069 0-.134.067-.167.067-.37.067-.637-.001-.97.065-.103 0-.169.1-.271.134-.3.098-.634.166-.869.333-.201.134-.503.5-.537.768-.034.101-.001.235-.001.334-.101.502-.168.836-.069 1.439.066.335-.135.569-.069.936 0 .033.067.102.067.135.033.2-.034.401-.001.568.033.135.1.334.065.536 0 .067-.067.133-.067.168 0 .066.101.233.134.401.033.267-.102.736.098.837.134.067.804-.032.938-.067.501-.098 1.27.038 1.738-.062.302-.067.703.067 1.037.002.069 0 .103-.033.168-.068.403-.065.936.104 1.372.004.033 0 .067-.033.134-.067.202-.033.468.035.67.001.167.001.234-.032.502.001.1.034.301.201.334.335 0 .068-.035.269-.001.403-.001.1.1.2.099.334.1.468-.002 1.171.065 1.64.033.134.099.2.099.335l-.169.367c-.033.2-.033.302-.234.334-.234.066-.468-.033-.669-.002-.034.033-.101.067-.168.067-.435.099-.903-.002-1.404.065l-.202.099c-.501.1-1.171-.036-1.74.064l-.97.1c-.302.065-.669-.037-.97-.002-.035.034-.102.066-.134.066-.133.032-.235-.001-.301-.001l-.237.368c-.032.134.034.368 0 .534 0 .068-.067.101-.067.168-.067.368-.002.869-.003 1.338l-.005 2.643c-.001.502-.002 1.104-.07 1.472-.068.302.033.603.066.77.067.302-.067.771-.002 1.037 0 .1.101.201.067.402-.034.301-.202.602-.136 1.003.032.268.065.771-.002 1.105-.034.1-.168.368-.235.401-.134.066-.469-.034-.669-.001-.068-.001-.134.066-.168.066-.267.068-.836.067-1.172-.002-.233-.033-.4-.101-.602-.068-.099 0-.2.1-.401.066-.033 0-.101-.067-.168-.067-.199-.034-.333-.001-.4-.169-.099-.3.1-.702.002-1.136-.034-.134-.133-.336-.132-.469 0-.134.099-.302.134-.435.035-.268-.034-.635.001-.937.135-.836.073-2.542.075-3.614l.004-1.74c.002-.703.069-1.504-.065-2.073-.033-.135-.2-.302-.265-.336-.101-.034-.203.067-.303.067-.167.032-.534-.001-.803.065-.101.033-.301.133-.469.099-.133-.034-.334-.167-.367-.268-.032-.1.034-.234.001-.367-.032-.168-.134-.37-.166-.57-.033-.068 0-.134 0-.202l-.101-.166c.001-.101.035-.168.001-.269 0-.1-.098-.401-.132-.534.001-.067.034-.2.001-.302-.035-.199-.101-.401-.101-.502 0-.066.035-.267.035-.301.201-.401 1.005-.398 1.54-.499.368-.032.903 0 1.005-.3.066-.266 0-.634.001-.935.001-.368.036-.703.002-.97-.067-.303-.065-.738.002-1.038.034-.234-.1-.436-.132-.704-.067-.4.002-1.138.069-1.438.102-.502-.032-1.039.07-1.504 0-.102.1-.302.134-.403l.069-.669c.067-.401.402-.869.639-1.204.335-.467.936-.868 1.574-1.134.401-.133.769-.366 1.238-.432.134-.032.268 0 .368 0 .167-.032.334-.134.535-.165.1.001.235.033.369.001.033 0 .1-.035.134-.069.201-.032.434.002.569-.032.335-.064 1.338-.097 1.739.004" />
                <Path d="m24.6459 16.7116954-.269.334c-.034.067-.135.067-.168.134l-.067.234c-.168.267-.335.5-.471.835-.032.134-.166.234-.2.335-.203.603-.337 1.068-.437 1.705l-.237.669c0 .101.033.268 0 .401-.035.201-.169.369-.169.502-.034.133 0 .234 0 .334-.035.167-.035.135-.001.301-.001.167-.134.301-.134.435 0 .068.065.101.065.167 0 .068-.065.101-.065.168-.035.201.032.468-.002.635l-.101.167c-.034.302-.035.737-.003 1.038.033.133 0 .234-.001.335.034.101.102.133.102.201-.001.133-.102.133-.102.234 0 0 .067.066.101.134.064.469.032.869.197 1.237.2.537.334 1.139.6 1.509.233.3.635.502.869.67.1.066.134.167.233.201.269.066.803.067 1.104.002.135-.033.335-.134.47-.199.234-.1.502-.2.636-.334.402-.334.236-.97.371-1.672.068-.335-.098-.771.002-1.138 0-.034.033-.067.068-.099.034-.236-.067-.503.001-.737.067-.335.069-.937.069-1.438.002-.437.069-1.005.003-1.272-.033-.034-.067-.067-.067-.134-.033-.135 0-.268 0-.402-.033-.167-.131-.335-.131-.436 0-.166.1-.467.133-.568.036-.2-.064-.535-.064-.669-.101-.369.002-.87-.065-1.305-.067-.268.035-.535.001-.738l-.099-.166c-.033-.234.067-.503.001-.736 0-.033-.033-.067-.067-.102-.068-.334.068-.668.002-.935-.034-.168-.3-.469-.434-.503-.167-.034-.535-.001-.637.032-.367.166-.836.334-1.037.634m3.79-5.413c.368.001.837.002 1.071.07.467.099.97-.1 1.104.336.033.101-.034.2 0 .336 0 .066.033.066.066.133.032.2-.068.502-.002.803 0 .034.033.066.068.099.033.236-.069.536-.002.804.033.2.098.769.064 1.104-.033.168-.101.267-.067.435 0 .066.065.1.065.168 0 .1-.066.133-.066.2-.034.235.132.536.132.703 0 .067-.068.133-.068.201 0 .033.068.133.068.167.131.635-.103 1.707-.005 2.341.034.135.034.135-.001.301-.034.201.033.503.067.67.031.2-.035.468-.002.703.166.902.062 2.309.06 3.412l-.003 1.639c-.002.57.065 1.206-.004 1.675-.032.032-.065.066-.065.133-.103.536-.002 1.205-.072 1.606-.033.167.068.269.068.367 0 .034-.069.102-.069.168-.032.168.033.501-.001.635 0 .068-.067.101-.067.168-.135.502.032 1.037-.069 1.573-.035.034-.068.1-.068.133-.034.168.033.369-.002.602l-.134.403c-.034.2 0 .368-.068.534-.033.066-.234.234-.302.268-.168.032-.4-.036-.534-.068-.435-.069-.87.065-1.238-.003-.068 0-.101-.068-.133-.068-.637-.134-1.641.132-1.874-.303-.033-.102-.066-.504-.167-.57-.066-.034-.232.033-.468.066-.134.033-.301 0-.401-.002-.033 0-.068.068-.135.068-.168.033-.469-.035-.735-.001-.235.033-.302.033-.501-.001-.236-.034-.437.031-.604-.001-.033 0-.066-.069-.1-.069-.367-.066-.602-.001-.936-.067-.134-.001-.234-.135-.368-.202-.536-.201-.869-.471-1.27-.839-.334-.367-.634-.67-.901-1.105l-.167-.336c-.201-.267-.3-.636-.433-1.004-.167-.502-.465-1.204-.566-1.741-.066-.269-.032-.468-.064-.738-.035-.166-.134-.301-.166-.501-.035-.233.001-.534-.067-.803 0-.033-.033-.066-.033-.1-.065-.235.034-.535.001-.769-.032-.134-.065-.235.001-.503 0-.066.033-.1.033-.133.069-.368-.031-.837.003-1.138.034-.1.034-.268.068-.435.034-.201.135-.335.167-.502.036-.167-.031-.335.002-.536 0-.134.101-.266.102-.399.032-.068 0-.201 0-.302.067-.401.202-.769.304-1.237.068-.469.301-.937.371-1.438.067-.336.267-.737.403-1.103.066-.134.033-.236.067-.334.034-.135.102-.168.135-.336.033-.166.2-.333.269-.534l.066-.335c.069-.201.237-.436.404-.634.134-.235.202-.469.335-.702.302-.435.571-.737.94-1.102.234-.235.368-.402.602-.569.403-.233.973-.567 1.374-.667.101-.033.201-.066.268-.066.301-.066.502.001.803-.065.066 0 .101-.066.134-.066.202-.068.536-.033.669 0 .066 0 .1.067.134.068.1.034.235 0 .333 0 .102 0 .168.068.236.068.335-.034.302-.569.603-.669.101-.033.235-.033.335-.032.201-.067.636-.032 1.003-.032" />
                <Path d="m36.4789 17.1335954c.2.032.568-.033.77.001.033 0 .1.066.134.066.233.035.467-.031.735.001.033 0 .101.069.134.069.434.066 1.004-.067 1.07.302.099.404-.169.836-.102 1.104.066.436.669-.064 1.005-.132.133-.033.233-.065.3-.065.302-.067.703.001 1.07-.065.368-.067.603-.067.905.001.333.068.634.002.97.069.133.001.2.034.367.068.2.032997.434.134.636.201.2.068.468.269.667.403.335.201.669.304.869.605.067.1.102.268.2.301.201.067.605-.534.739-.6.2-.168.334-.234.569-.368.334-.199.603-.468 1.037-.533.102-.034.268.034.369.001.066 0 .101-.068.167-.068.368-.099.704-.065 1.071.003.1 0 .202-.032.3 0 .069 0 .101.068.167.068.235.034.437.001.636.067.134.035.403.169.569.271.402.2.903.502 1.169.871.133.167.235.369.368.568.133.202.333.404.433.704.067.167.067.368.133.537.066.168.233.435.267.669.034.1 0 .167-.001.234.034.067.133.133.133.201.067.168.034.335.066.535.033.101.1.202.135.336l.131.669c.033.134 0 .267-.001.4 0 .034.067.068.067.135.033.135-.034.335-.002.469 0 .033.068.066.068.099.033.135-.035.302-.001.404 0 .065.067.065.067.133.033.167-.035.435-.001.635 0 .068.066.101.065.167.034.268-.034.503 0 .736-.001.069.066.102.066.168.034.168-.033.334-.068.469-.1.401-.068.937-.07 1.571 0 .403-.067.871-.002 1.171.066.303.065.836-.002 1.205-.034.134-.101.268-.067.368.033.201.033.201-.001.402-.035.167.033.436-.001.636-.069.335-.035.769-.136 1.27-.104.57.097 1.206-.004 1.707-.034.167-.134.636-.202.669-.201.134-.47.032-.77.099-.334.033-.736.033-1.104-.002-.268-.068-.368-.068-.568-.001-.168.032-.403-.001-.571-.001-.199-.034-.434-.068-.533-.202-.167-.368-.098-1.64.004-2.207.033-.236-.033-.537.002-.738 0-.099.1-.434.134-.534.067-.369.069-1.439.004-1.807 0-.033-.068-.101-.068-.134 0-.101.103-.268.135-.402.033-.133-.032-.3 0-.434.068-.335.07-.87.071-1.473.001-.535.002-1.104-.065-1.439-.099-.502.002-1.138-.064-1.571 0-.068-.066-.134-.066-.202-.032-.167.034-.369.001-.569-.066-.334-.199-.67-.266-1.104-.065-.469-.299-1.004-.465-1.271-.1-.136-.3-.203-.468-.304-.101-.067-.101-.201-.368-.167-.133.034-.635.3-.771.399-.1.068-.267.234-.335.335-.066.1-.1.266-.168.367-.134.234-.303.401-.436.668-.134.167-.101.469-.067.669-.001.168-.035.335-.001.502.065.434.064 1.205.062 1.908-.001.635.065 1.305-.003 1.74-.033.033-.067.133-.067.166 0 .067.066.136.066.235-.033.3-.134.535-.068.802 0 .134.034.135 0 .302-.035.167.032.436-.002.568-.033.068-.067.101-.067.167-.067.202.032.469-.002.704-.033.066-.066.099-.066.133-.102.536.064 1.104-.003 1.539-.068.235-.201.435-.135.702 0 .068.066.135.066.202-.001.067-.067.1-.067.201-.067.3-.036.736-.069 1.036-.034.034-.068.067-.068.102-.068.234.034.6-.001.87-.034.065-.067.133-.068.165 0 .101.102.202.067.37-.033.065-.068.065-.068.134-.065.231.033.567-.002.869-.033.166-.1.301-.134.4-.034.235.067.503-.035.603-.134.2-.366.099-.635.134-.067 0-.1.065-.168.065-.267.067-.535-.001-.802-.068-.369-.069-.804.065-1.171-.002-.068 0-.1-.034-.168-.068-.468-.1-.803.166-.903-.302-.032-.101-.066-.235-.066-.334-.065-.402.068-.837.137-1.104.033-.168-.067-.27-.067-.402 0-.167.168-.403.135-.636-.033-.167-.066-.201.001-.369.068-.467-.065-1.036.037-1.505.033-.034.067-.066.067-.134.033-.167-.033-.434.001-.636l.101-.2c.033-.2-.033-.434.001-.67.001-.166.1-.301.135-.433.068-.403-.099-.838.002-1.272 0-.135.1-.702.036-1.037 0-.101-.101-.368-.032-.602.067-.535.234-1.138.102-1.672-.065-.335-.065-.57.002-.905.033-.168.034-.468.001-.669-.065-.401-.064-.704-.097-.936-.034-.134 0-.269 0-.368-.067-.301-.132-.804-.233-1.106-.133-.536-.332-1.071-.732-1.373l-.403-.268c-.066 0-.2.034-.266-.001-.201-.034-.168-.034-.368 0-.101.034-.301-.034-.435-.001-.234.033-.47.232-.67.334-.402.133-.704.265-.972.466-.335.233-.803.6-.905 1.068 0 .135.033.303.033.402l-.101.201c0 .1.033.2 0 .3-.035.301-.103.603-.036.904.034.235.033.402-.001.77-.068.2-.068.268-.002.502.034.301-.034.701-.068.869-.1.269.033.805-.002 1.071-.034.034-.067.067-.067.134-.067.333.065.737-.002 1.104l-.137 1.003c-.1.468-.002 1.004-.003 1.573l-.005 3.111c0 .535-.069 1.138-.003 1.572.066.468.132.939-.27 1.004-.268.067-.535-.035-.803-.002-.067.035-.099.068-.133.068-.334.065-.669-.069-1.003-.002-.404.098-1.474.197-1.574-.272-.065-.434.002-.936.003-1.639l.014-6.958c.001-.738-.064-1.306.003-1.841.102-.502-.03-1.105.07-1.64.069-.267-.031-.502.001-.736.034-.033.069-.1.069-.134.1-.501-.067-.971.002-1.438.034-.1.067-.134.1-.166.035-.236-.065-.437.002-.67 0-.033.034-.101.068-.134.033-.233-.067-.501.001-.771 0-.132.1-.266.101-.433.034-.201-.033-.435.001-.636.034-.034.067-.101.067-.134.034-.167 0-.301 0-.468 0-.034.069-.067.069-.134.033-.134-.034-.301 0-.435 0-.067.068-.134.1-.168.069-.333.002-.736.035-1.07.036-.134.134-.233.134-.333.07-.303.036-.535.071-.77.067-.369.202-.838.537-.902.099-.034.232-.034.3-.034.1-.032.134.001.268.035" />
                <Path d="m62.224 8.5642954c.135.001.235-.066.334-.066.035 0 .102.034.168.067.234.034.502.001.636.067.167.07.167.336.199.637.033.134.101.201.1.368l-.102.201c-.033.268-.034.837-.002 1.138l.102.2c.031.302.029 1.037-.002 1.473l-.104.2c-.1.637-.002 1.573-.004 2.242l-.008 4.485c-.002.768-.102 1.57-.004 2.241.067.334.133.601.1.936l-.101.201c-.035.202-.035.503-.001.703.032.168.132.266.098.535-.068.302-.235.902-.169 1.406.066.435.031.768-.071 1.203-.033.234 0 .535 0 .702.032.202.032.167-.001.37-.034.199.033.534-.001.736 0 .065-.033.133-.033.199-.069.268.032.603-.104.771-.1.099-.502.166-.669.199-.201.033-.3-.034-.434-.068-.636-.101-1.406.064-1.974-.004-.101 0-.135-.068-.201-.068-.167-.032-.436.033-.535-.001-.301-.1-.333-1.238-.264-1.707l.1-.199c.034-.368-.067-.704.002-1.071.102-.87-.03-1.875.105-2.643.068-.401-.065-.804-.098-1.104-.066-.301.068-.602.102-.971.033-.2-.032-.435 0-.669.138-.903.004-1.94.007-3.012.001-1.136.071-1.939.073-3.144l.007-3.68c.001-.637.069-1.306.004-1.808 0-.066-.068-.167-.068-.234 0-.066.068-.1.069-.168.067-.334.134-.568.402-.634.1 0 .201.034.302 0 .065 0 .133-.033.2-.033.334-.066.736-.031.938-.064.201-.033.668.035.902.068m-.32-7.529c.066.034.201 0 .268 0 .602.101 1.07.638 1.269 1.175.098.266.066.635.132.97.033.134.133.235.1.403l-.101.132c-.034.201 0 .369-.067.537-.169.768-.539 1.336-1.242 1.667-.268.135-.502.134-.972.134-.266 0-.501.065-.702-.002-.167-.032-.568-.235-.735-.335-.435-.302-.735-.738-.935-1.274-.199-.468-.333-.903-.231-1.539.137-.735.472-1.237 1.073-1.537l.437-.133c.065-.033.133-.101.233-.133.235-.067.502-.066.771-.099.268-.067.534 0 .702.034" />
                <Path d="m72.1606 7.4811954c.47.102 1.104-.099 1.205.338.033.233-.068.703-.002.97l-.002.369c-.033.199 0 .434 0 .6-.101.536-.035 1.205-.138 1.774-.035.267-.068.602-.068.803 0 .134.134.268.134.369-.002.132-.136.334-.169.5-.067.336-.034 1.005-.004 1.373.033.168.033.168 0 .368 0 .168.033.4-.002.602-.065.569.031 1.74-.036 2.409-.033.034-.068.134-.068.167 0 .101.066.168.066.234-.033.134-.132.302-.134.469 0 .234.066.503.064.802v.837c-.002.602-.103 1.204-.004 1.707.132.836.029 1.673-.071 2.374-.034.269-.034.637-.002.872.098.702.131 1.338.063 1.874-.101.434-.002 1.036-.002 1.605-.002.568-.036 1.305.065 1.739.063.536-.071 1.072-.004 1.472.033.369.131 1.206.031 1.707-.002.168-.169.469-.202.503-.101 0-.201-.035-.301-.001-.101 0-.169.066-.236.066-.099-.001-.132-.067-.268-.067-.2-.068-.401.032-.602.065-.3.067-.802.032-1.071-.002-.1 0-.166-.067-.234-.067-.101-.034-.168.066-.268.066-.134 0-.201-.066-.366-.068-.169-.067-.269 0-.369-.167-.167-.336.002-1.004-.097-1.508-.068-.501-.132-1.304-.065-1.772.034-.1.069-.167.069-.267.032-.302-.167-.603-.1-1.004.17-1.104.038-2.745.042-3.981 0-.436.069-.87.001-1.239-.064-.569-.063-1.172.002-1.607.171-.969-.128-2.107.006-3.144.035-.067.07-.101.07-.167.1-.501-.066-1.004.003-1.472.033-.067.067-.134.067-.167.134-.669-.099-1.306.004-1.874l.099-.233c.035-.335-.066-.704.002-1.073.001-.199.102-.4.103-.568 0-.101-.034-.167-.033-.233 0-.068.033-.1.033-.168.032-.2-.032-.468.002-.703.032-.033.067-.1.067-.133.134-.637-.033-1.538.072-2.276.031-.066.066-.134.066-.201.034-.233-.033-.468 0-.669l.103-.2c.067-.467-.099-1.707.271-1.906.167-.101.501-.133.536-.133.333-.067 1.202-.031 1.672.036" />
                <Path d="m82.0721826 16.9491139c0 .101.099.268.132.368 0 .101-.033.2 0 .269.033.367.267.602.334.936.033.201 0 .302.033.537.065.233.232.467.298.736.133.77.365 1.573.565 2.378.066.167.166.333.2.535.033.099-.002.201-.002.301.033.133.167.3.2.468.1.435.167.871.267 1.24l.066.3c.033.202.165.368.2.535.033.068 0 .167-.002.234.035.101.134.169.134.236l.066.469c.066.3.199.568.266.901.1.404.301.805.399 1.241l.134.401c.066.268.366.871.398.904.035 0 .168-.1.202-.2.133-.167.269-.468.336-.669.067-.099.067-.134.102-.233 0-.068.099-.167.134-.234.033-.1 0-.236.065-.335.104-.335.405-.801.54-1.136.033-.134.066-.335.134-.502.101-.301.236-.536.335-.869.136-.502.338-.971.505-1.471.103-.202.169-.234.203-.502.102-.536.437-.97.538-1.37.034-.068 0-.101 0-.168.034-.135.201-.302.27-.501l.065-.302c.136-.334.27-.567.338-.869.033-.167.2-.3.268-.467.1-.368.267-.703.403-1.071.102-.3.27-.669.437-.769.235-.133.57-.065.803.002.066.034.235.168.333.202.402.1.836.335 1.271.47.369.169.969.437 1.036.737.035.069 0 .302 0 .37-.068.334-.403.836-.537 1.203-.202.635-.437 1.204-.673 1.806-.1.234-.169.534-.271.802-.098.301-.133.568-.236.903-.066.201-.167.3-.234.535-.102.368-.27.802-.404 1.203-.2.67-.469 1.304-.707 1.939-.133.336-.301.669-.403 1.003-.067.134-.067.268-.134.435-.034.067-.1.101-.134.133l-.002.202c-.033.133-.234.367-.269.535-.033.066 0 .099 0 .133-.167.436-.535.903-.671 1.47-.101.302-.401.535-.47.803v.101c-.1.267-.368.467-.469.768-.27.703-.772 1.337-1.077 2.04l-.133.468c-.067.267-.234.435-.336.701-.101.368-.303.67-.437 1.036-.033 0 0 .068 0 .101-.067.168-.201.335-.267.502-.068.1-.036.2-.07.302-.066.167-.167.265-.202.4l-.202.735c-.134.402-.335.768-.469 1.204-.101.301-.101.536-.403.635-.167.066-.802.132-1.137.064-.033 0-.101-.066-.135-.066-.199-.034-.435.033-.602-.001-.033 0-.067-.067-.132-.069-.169-.032-.336.034-.47 0-.033 0-.1-.066-.133-.066-.301-.068-.67.064-.804-.102-.032 0-.134-.202-.134-.202-.065-.168.002-.468.07-.701.034-.302.202-.536.27-.87.033-.301.167-.536.267-.802.069-.201.101-.469.203-.703.067-.236.236-.434.335-.669.068-.267.168-.501.269-.736l.102-.468c.102-.3.302-.568.403-.869.101-.235.169-.501.067-.803.002-.101-.098-.134-.133-.235-.231-.635-.431-1.339-.665-2.042-.099-.367-.264-.737-.365-1.138-.099-.234-.134-.368-.198-.702-.101-.37-.334-.738-.401-1.106v-.2c-.067-.302-.264-.604-.332-.904-.398-1.741-.931-3.214-1.329-4.921-.033-.167-.166-.369-.2-.536-.167-.703-.334-1.439-.532-2.177-.032-.2-.164-.366-.199-.602l-.165-.903c-.099-.268-.233-.637-.299-.938 0-.1.033-.233 0-.336-.065-.299-.199-.634-.266-.935-.033-.235.002-.536-.066-.738-.032-.167-.03-.435.202-.534.268-.133.637.002 1.106-.098.033 0 .066-.033.099-.033.636-.133 1.338.103 1.707.003.032-.034.032-.068.066-.068.503-.03.601.505.735 1.006" />
            </G>
        </G>
    </Svg>
));

export default (props: Props) => themedRender(Logo, props);