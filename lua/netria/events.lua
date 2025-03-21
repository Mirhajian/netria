local M = {}

local config = require('netria.config')
local state = require('netria.state')
local ui = require('netria.ui')
local banner = require('netria.banner')
local netrw = require('netria.netrw')

function M.setup()
  vim.api.nvim_create_autocmd("FileType", {
    pattern = "netrw",
    callback = function(ev)
      if not vim.tbl_contains(state.netrw_bufs, ev.buf) then
        table.insert(state.netrw_bufs, ev.buf)
      end
      
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        ui.apply_window_settings(state.win_id)
        
        if vim.api.nvim_get_current_win() == state.win_id then
          state.buf_id = ev.buf
          
          vim.defer_fn(function()
            state.current_dir = state.get_netrw_directory()
          end, 10)
          
          -- add banner if not already added
          vim.defer_fn(function()
            if vim.api.nvim_buf_is_valid(ev.buf) then
              banner.add_custom_banner(ev.buf, state.win_id)
            end
          end, 50)
        end
      end
    end
  })
  
  -- handle directory changes within netrw
  vim.api.nvim_create_autocmd("BufEnter", {
    callback = function(ev)
      if state.is_netrw_buffer(ev.buf) and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        vim.defer_fn(function()
          state.current_dir = state.get_netrw_directory()
        end, 10)
        
        vim.defer_fn(function()
          if vim.api.nvim_buf_is_valid(ev.buf) then
            banner.add_custom_banner(ev.buf, state.win_id)
          end
        end, 30)
      end
    end
  })
  
  vim.api.nvim_create_autocmd("BufEnter", {
    callback = function(ev)
      vim.schedule(function()
        if not state.is_netrw_buffer(ev.buf) and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
          state.last_opened_file = ev.buf
          
          local file_path = vim.api.nvim_buf_get_name(ev.buf)
          if file_path and file_path ~= "" then
            state.current_dir = vim.fn.fnamemodify(file_path, ":h")
          end
          
          vim.api.nvim_win_close(state.win_id, true)
          state.win_id = nil
          
          local win_list = vim.api.nvim_list_wins()
          if #win_list > 0 then
            vim.api.nvim_set_current_win(win_list[1])
            vim.api.nvim_set_current_buf(ev.buf)
            
            if config.values.apply_numbers_to_files then
              if config.values.show_line_numbers then
                vim.wo[win_list[1]].number = true
              end
              
              if config.values.show_relative_numbers then
                vim.wo[win_list[1]].relativenumber = true
              end
            end
          end
        end
      end)
    end
  }) 

  vim.api.nvim_create_autocmd("BufLeave", {
    callback = function(ev)
      if state.is_netrw_buffer(ev.buf) and state.started_with_dir then
        vim.schedule(function()
          if state.win_id and not vim.api.nvim_win_is_valid(state.win_id) and state.count_real_buffers() == 0 then
            vim.cmd("qa")
          end
        end)
      end
    end
  })
  
  vim.api.nvim_create_autocmd("WinClosed", {
    callback = function(ev)
      if tonumber(ev.match) == state.win_id and state.started_with_dir then
        if state.count_real_buffers() == 0 then
          vim.schedule(function()
            vim.cmd("qa")
          end)
        end
      end
    end
  })
  
  vim.api.nvim_create_autocmd("WinNew", {
    callback = function()
      vim.schedule(function()
        local current_win = vim.api.nvim_get_current_win()
        local current_buf = vim.api.nvim_win_get_buf(current_win)
        
        if not state.is_netrw_buffer(current_buf) and config.values.apply_numbers_to_files then
          if config.values.show_line_numbers then
            vim.wo[current_win].number = true
          end
          
          if config.values.show_relative_numbers then
            vim.wo[current_win].relativenumber = true
          end
        end
      end)
    end
  })
  
  vim.api.nvim_create_autocmd("BufWinEnter", {
    callback = function(ev)
      if not state.is_netrw_buffer(ev.buf) and config.values.apply_numbers_to_files then
        for _, win_id in ipairs(vim.fn.win_findbuf(ev.buf)) do
          if config.values.show_line_numbers then
            vim.wo[win_id].number = true
          end
          
          if config.values.show_relative_numbers then
            vim.wo[win_id].relativenumber = true
          end
        end
      end
    end
  })
  
  vim.api.nvim_create_autocmd("BufDelete", {
    callback = function(ev)
      for i, buf_id in ipairs(state.netrw_bufs) do
        if buf_id == ev.buf then
          table.remove(state.netrw_bufs, i)
          break
        end
      end
      
      state.banner_buffers[ev.buf] = nil
    end
  })
  
  vim.api.nvim_create_autocmd("VimLeavePre", {
    callback = function()
      for _, buf_id in ipairs(state.netrw_bufs) do
        if vim.api.nvim_buf_is_valid(buf_id) then
          vim.api.nvim_buf_delete(buf_id, { force = true })
        end
      end
      state.netrw_bufs = {}
      state.banner_buffers = {}
    end
  })
  
  vim.api.nvim_create_autocmd("QuitPre", {
    callback = function()
      if state.started_with_dir and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local current_win = vim.api.nvim_get_current_win()
        
        if current_win == state.win_id and state.count_real_buffers() == 0 then
          vim.schedule(function()
            vim.cmd("qa")
          end)
        end
      end
    end
  })

  vim.api.nvim_create_autocmd("WinScrolled", {
    callback = function()
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local buf_id = vim.api.nvim_win_get_buf(state.win_id)
        if state.is_netrw_buffer(buf_id) and config.values.banner.enabled and #config.values.banner.art > 0 then
          for i = 1, #config.values.banner.art do
            vim.fn.sign_define("BannerLine" .. i, { text = " ", texthl = "LineNr" })
            vim.fn.sign_place(i, "BannerSigns", "BannerLine" .. i, buf_id, { lnum = i })
          end
        end
      end
    end
  })

  vim.api.nvim_create_autocmd({"BufWritePost", "TextChanged", "TextChangedI"}, {
    pattern = "*",
    callback = function(ev)
      if not state.is_netrw_buffer(ev.buf) then 
        return 
      end
      
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) and 
         vim.api.nvim_win_get_buf(state.win_id) == ev.buf then
        
        vim.defer_fn(function()
          if vim.api.nvim_buf_is_valid(ev.buf) then
            banner.add_custom_banner(ev.buf, state.win_id)
          end
        end, 30)
      end
    end
  })

  vim.api.nvim_create_autocmd("DirChanged", {
    callback = function()
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local buf = vim.api.nvim_win_get_buf(state.win_id)
        if state.is_netrw_buffer(buf) then
          state.current_dir = vim.fn.getcwd()
          
          vim.defer_fn(function()
            if vim.api.nvim_buf_is_valid(buf) then
              banner.add_custom_banner(buf, state.win_id)
            end
          end, 50)
        end
      end
    end
  })
  
  vim.api.nvim_create_autocmd("User", {
    pattern = "NetrwRefresh",
    callback = function()
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local buf = vim.api.nvim_win_get_buf(state.win_id)
        if state.is_netrw_buffer(buf) then
          vim.defer_fn(function()
            if vim.api.nvim_buf_is_valid(buf) then
              banner.add_custom_banner(buf, state.win_id)
            end
          end, 30)
        end
      end
    end
  })
  
  vim.api.nvim_create_autocmd("BufHidden", {
    pattern = "*",
    callback = function(ev)
      if state.is_netrw_buffer(ev.buf) and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        vim.schedule(function()
          local current_buf = vim.api.nvim_win_get_buf(state.win_id)
          if state.is_netrw_buffer(current_buf) then
            banner.add_custom_banner(current_buf, state.win_id)
          end
        end)
      end
    end
  })
end

return M
