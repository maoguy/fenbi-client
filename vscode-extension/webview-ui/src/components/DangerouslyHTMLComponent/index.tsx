import useVscodeTheme from '../../common-lib/hooks/useVscodeTheme';
import styled from 'styled-components';

type TVscTheme = "vscode-dark"|"vscode-light";

interface StyledElementProps {
  vscTheme?:TVscTheme;
}

const StyledDiv = styled.div<StyledElementProps>`
  img{
    /* 当vscode主题为dark模式时,将img标签进行反转色 */
    filter: ${props => props?.vscTheme==="vscode-dark"?"invert(100%)":"none"};
  }
`;


const StyledSpan = styled(StyledDiv)`
  display: inline-block;
`;

export enum TTagTypes {
  SPAN="SPAN",
  DIV="DIV",
}

interface TProps {
  type?:TTagTypes;
  children:string;
}

function DangerouslyHTMLComponent (props:TProps) {
  const {
    type=TTagTypes.DIV,
    children
  } = props;
  const {theme:vscTheme} = useVscodeTheme();
  const Comp = type===TTagTypes.DIV?StyledDiv:StyledSpan;
  // 将img标签中src全部加上https
  const content = children.replace(
    /(<img[^>]+src=\")([^"]+)/g,
    function (match: any, p1: string, p2: string) {
      // 如果 src 已经包含 https:，则不修改
      if (p2.startsWith("https:")) {
        return p1 + p2;
      }
      // 如果没有 https:，则添加
      return p1 + "https:" + p2;
    }
  );
  return (
    <>
      <Comp
        vscTheme={vscTheme as TVscTheme}
        dangerouslySetInnerHTML={{
          __html:content
        }}
      />
    </>
  );
}

export default DangerouslyHTMLComponent;