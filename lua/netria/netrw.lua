local M = {}

local state = require('netria.state')
local banner = require('netria.banner')

function M.setup_hooks()
  _G.Netria_UpdateCurrentDir = function()
    local cur_buf = vim.api.nvim_get_current_buf()
    if state.is_netrw_buffer(cur_buf) then
      state.current_dir = state.get_netrw_directory()
      
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) and 
         vim.api.nvim_win_get_buf(state.win_id) == cur_buf then
        vim.defer_fn(function()
          if vim.api.nvim_buf_is_valid(cur_buf) then
            banner.add_custom_banner(cur_buf, state.win_id)
          end
        end, 30)
      end
    end
  end
  
  vim.cmd([[
    augroup NetriaNetrwHook
      autocmd!
      autocmd User NetrwBrowseChgDir call v:lua.Netria_UpdateCurrentDir()
    augroup END
  ]])
  
  vim.cmd([[
    function! NetriaNetrwRefreshHook()
      doautocmd User NetrwRefresh
    endfunction

    let g:Netrw_funcref = function('NetriaNetrwRefreshHook')
  ]])
  
  vim.g.netrw_keepdir = 1
  vim.g.netrw_browse_split = 0
  vim.g.netrw_altv = 1
  vim.g.netrw_winsize = 25
end

function M.handle_directory_args()
  local args = vim.fn.argv()
  if #args > 0 then
    local stat = vim.loop.fs_stat(args[1])
    if stat and stat.type == "directory" then
      state.started_with_dir = true
      state.original_buf = vim.api.nvim_get_current_buf()
      -- state.current_dir = args[1]
      state.current_dir = vim.fn.fnamemodify(args[1], ":p")
      
      vim.cmd("silent! bwipeout!")
      
      return true
    end
  end
  return false
end

return M
