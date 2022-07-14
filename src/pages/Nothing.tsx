/*
 * @Author       : ganbowen
 * @Date         : 2022-07-13 13:50:33
 * @LastEditors  : ganbowen
 * @LastEditTime : 2022-07-14 10:00:53
 * @Descripttion : 404
 */
import {
   Link
  } from "react-router-dom";
export default function Nothing() {
    return (
      <div>
        <h2 className="nothing">Nothing</h2>
        <div className="nothing-to-home">
            <Link to='/game'>去大厅...</Link>
        </div>
      </div>
    );
}